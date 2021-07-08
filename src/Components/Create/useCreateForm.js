import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDefaultCategoryFields } from '../../data/categoryFields';

export const initialValues = {
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
  status: 'active',
  adType: 'for_sale',
  priceType: 'fixed',
  tags: [],
  videoUrl: '',
  delivery: {
    available: false,
    type: 'pickup',
    shippingCost: 0,
    estimatedDays: '',
  },
  warranty: { available: false, type: '', description: '' },
  returnPolicy: 'no_returns',
  paymentMethods: [],
  contactPreference: 'both',
  availableFrom: '',
};

export function useCreateForm() {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const repost = history.location.state?.repost;
    if (repost && typeof repost === 'object') {
      setValues({
        ...initialValues,
        name: repost.name || '',
        category: repost.category || '',
        subcategory: repost.subcategory || '',
        price: repost.price != null ? String(repost.price) : '',
        description: repost.description || '',
        images:
          Array.isArray(repost.images) && repost.images.length
            ? repost.images
            : repost.url
              ? [repost.url]
              : [],
        condition: repost.condition || '',
        negotiable: Boolean(repost.negotiable),
        listedBy: repost.listedBy || '',
        location: repost.location || {},
        extra: repost.extra || {},
        adType: repost.adType || 'for_sale',
        priceType: repost.priceType || 'fixed',
        tags: Array.isArray(repost.tags) ? repost.tags : [],
        videoUrl: repost.videoUrl || '',
        delivery: repost.delivery || initialValues.delivery,
        warranty: repost.warranty || initialValues.warranty,
        returnPolicy: repost.returnPolicy || 'no_returns',
        paymentMethods: Array.isArray(repost.paymentMethods)
          ? repost.paymentMethods
          : [],
        contactPreference: repost.contactPreference || 'both',
        availableFrom: repost.availableFrom || '',
        status: 'active',
      });
      history.replace('/create', {});
    }
  }, [history]);

  const onChange = useCallback((field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        next.extra = getDefaultCategoryFields(value);
        next.subcategory = '';
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev, [field]: null };
      // Location: only clear error when both state and city are filled
      if (field === 'location' && value && typeof value === 'object') {
        if (!value.state || !value.city) {
          next.location = prev.location; // keep the error
        }
      }
      // When 'extra' changes, clear all extra.* field errors for the keys that now have values
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

  return {
    values,
    setValues,
    loading,
    setLoading,
    draftLoading,
    setDraftLoading,
    errors,
    setErrors,
    onChange,
  };
}
