import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import { getCategoryFields } from '../../data/categoryFields';
import { getProductRef } from '../../firebase/collections';
import { Firebase } from '../../firebase/config';
import { notifyPriceDrop } from '../../firebase/notifications';
import { recordPriceHistory } from '../../firebase/priceHistory';
import {
  validateAdDescription,
  validateAdTitle,
  validatePrice,
} from '../../utils/validation';
import OverlaySpinner from '../Loading/OverlaySpinner';
import AdForm from './AdForm';
import './Create.css';

const initialValues = {
  name: '',
  category: '',
  subcategory: '',
  price: '',
  description: '',
  images: [],
  condition: '',
  negotiable: false,
  listedBy: '',
  location: {},
  extra: {},
};

function EditAd() {
  const { adId } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const initialPriceRef = React.useRef(null);

  const onChange = useCallback((field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        next.subcategory = '';
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev, [field]: null };
      // Location: only clear error when both state and city are filled
      if (field === 'location' && value && typeof value === 'object') {
        if (!value.state || !value.city) {
          next.location = prev.location;
        }
      }
      // When 'extra' changes, clear extra.* errors for filled keys
      if (field === 'extra' && value && typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          if (v !== '' && v != null) {
            next[`extra.${k}`] = null;
          }
        });
      }
      // When category changes, clear all extra.* errors
      if (field === 'category') {
        Object.keys(prev).forEach((k) => {
          if (k.startsWith('extra.')) next[k] = null;
        });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!adId || !user) return;
    getProductRef(adId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          setError('Ad not found');
          setLoading(false);
          return;
        }
        const data = doc.data();
        if (data.userId !== user.uid) {
          setError('You can only edit your own ads');
          setLoading(false);
          return;
        }
        const priceVal =
          data.price !== undefined && data.price !== null ? data.price : '';
        initialPriceRef.current =
          typeof priceVal === 'number' ? priceVal : Number(priceVal) || null;
        setValues({
          name: data.name || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          price:
            typeof priceVal === 'number' || typeof priceVal === 'string'
              ? String(priceVal)
              : '',
          description: data.description || '',
          condition: data.condition || '',
          negotiable: Boolean(data.negotiable),
          listedBy: data.listedBy || '',
          location: data.location || {},
          extra: data.extra || {},
          images:
            data.images && data.images.length
              ? data.images
              : data.url
                ? [data.url]
                : [],
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load ad');
        setLoading(false);
      });
  }, [adId, user]);

  const scrollToFirstError = (errs) => {
    setTimeout(() => {
      const keys = Object.keys(errs);
      if (!keys.length) return;
      for (const key of keys) {
        const clean = key.replace('extra.', '');
        if (clean === 'location') {
          const stateEl = document.getElementById('ad-location-state');
          const cityEl = document.getElementById('ad-location-city');
          const target = stateEl && !stateEl.value ? stateEl : cityEl;
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.focus({ preventScroll: true });
            return;
          }
        }
        const el = document.getElementById(`ad-${clean}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus({ preventScroll: true });
          return;
        }
      }
      const errEl = document.querySelector('.cf-error');
      if (errEl) errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = () => {
    const err = {};

    if (!values.category?.trim()) err.category = 'Please select a category.';
    const tErr = validateAdTitle(values.name);
    if (tErr) err.name = tErr;
    const dErr = validateAdDescription(values.description);
    if (dErr) err.description = dErr;
    const pErr = validatePrice(values.price);
    if (pErr) err.price = pErr;
    if (!values.condition?.trim()) err.condition = 'Please select a condition.';

    const existingUrls = values.images.filter((i) => typeof i === 'string');
    const newFiles = values.images.filter((i) => i instanceof File);
    if (existingUrls.length === 0 && newFiles.length === 0)
      err.images = 'Please add at least one image.';

    if (!values.location?.state || !values.location?.city)
      err.location = 'Please select your state and city.';

    // Validate category-specific required fields
    const catFields = getCategoryFields(values.category);
    const extra = values.extra || {};
    catFields.forEach((f) => {
      if (f.required) {
        const val = extra[f.key];
        if (val === undefined || val === null || String(val).trim() === '') {
          err[`extra.${f.key}`] = `${f.label.replace(/\s*\*/, '')} is required`;
        }
      }
    });

    setErrors(err);
    if (Object.keys(err).length > 0) {
      const count = Object.keys(err).length;
      addToast(
        `Please fix ${count} error${count > 1 ? 's' : ''} before saving.`,
        'error'
      );
      scrollToFirstError(err);
      return;
    }

    setSaving(true);
    const uploadNew = newFiles.map((file) =>
      Firebase.storage()
        .ref(`/image/${user.uid}_${Date.now()}_${file.name}`)
        .put(file)
        .then(({ ref }) => ref.getDownloadURL())
    );
    Promise.all(uploadNew)
      .then((newUrls) => {
        const allUrls = [...existingUrls, ...newUrls];
        const newPrice = Number(values.price);
        const updateData = {
          name: values.name,
          category: values.category,
          subcategory: values.subcategory || null,
          price: newPrice,
          description: values.description,
          url: allUrls[0],
          images: allUrls,
          condition: values.condition || null,
          negotiable: Boolean(values.negotiable),
          listedBy: values.listedBy || null,
          location:
            values.location && (values.location.city || values.location.state)
              ? values.location
              : null,
          updatedAt: new Date().toISOString(),
        };
        if (values.extra && Object.keys(values.extra).length > 0) {
          const extraClean = {};
          Object.entries(values.extra).forEach(([k, v]) => {
            if (v !== '' && v != null) extraClean[k] = v;
          });
          updateData.extra =
            Object.keys(extraClean).length > 0 ? extraClean : null;
        }
        return getProductRef(adId)
          .update(updateData)
          .then(() => {
            if (
              initialPriceRef.current !== null &&
              newPrice !== initialPriceRef.current
            ) {
              return recordPriceHistory(adId, newPrice).then(() =>
                notifyPriceDrop(adId, values.price, values.name)
              );
            }
            return notifyPriceDrop(adId, values.price, values.name);
          });
      })
      .then(() => history.push('/dashboard'))
      .catch(() => setSaving(false))
      .finally(() => setSaving(false));
  };

  if (!user) {
    return (
      <div className="profilePage">
        <p>Please log in to edit ads.</p>
      </div>
    );
  }

  if (loading) {
    return <OverlaySpinner />;
  }

  if (error) {
    return (
      <div className="profilePage">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Fragment>
      {saving && <OverlaySpinner />}
      <div className="createPageWrap">
        <div className="createPageActions">
          <Link to="/dashboard" className="createCancelLink">
            ← Back to Dashboard
          </Link>
        </div>
        <AdForm
          values={values}
          onChange={onChange}
          errors={errors}
          loading={saving}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </Fragment>
  );
}

export default EditAd;
