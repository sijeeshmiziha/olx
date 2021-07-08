import React from 'react';
import {
  getCategoriesSorted,
  getSubcategories,
} from '../../../data/categories';
import { getCategoryFields } from '../../../data/categoryFields';
import '../Create.css';
import ImageUploader from '../ImageUploader';
import LocationSelector from '../LocationSelector';
import CategorySection from './CategorySection';
import DeliverySection from './DeliverySection';
import DetailsSection from './DetailsSection';
import { FormSection } from './FormSection';
import PricingSection from './PricingSection';

const PAGE_HEADER_ICON = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const PHOTOS_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const LOCATION_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CHECK_ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SAVE_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const SPINNER_ICON = (
  <svg
    className="cf-btn-spinner"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="50 20"
    />
  </svg>
);

function AdForm({
  values,
  onChange,
  errors = {},
  loading = false,
  draftLoading = false,
  onSubmit,
  submitLabel,
  onSaveDraft,
}) {
  const anyLoading = loading || draftLoading;
  const categoriesList = getCategoriesSorted();
  const subcategoriesList = getSubcategories(values.category);
  const categoryFields = getCategoryFields(values.category);
  const extra = values.extra || {};
  const categoryHasListedBy = categoryFields.some((f) => f.key === 'listedBy');

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(field, value);
  };
  const handleExtraChange = (key) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange('extra', { ...extra, [key]: value });
  };

  return (
    <div className="cf-card">
      <div className="cf-page-header">
        <div className="cf-page-header-icon">{PAGE_HEADER_ICON}</div>
        <div>
          <h2 className="cf-page-title">Post your ad</h2>
          <p className="cf-page-subtitle">
            Fill in the details below to list your item
          </p>
        </div>
      </div>

      <CategorySection
        values={values}
        onChange={onChange}
        errors={errors}
        categoriesList={categoriesList}
        subcategoriesList={subcategoriesList}
        categoryFields={categoryFields}
        handleChange={handleChange}
        handleExtraChange={handleExtraChange}
        extra={extra}
      />
      <DetailsSection
        values={values}
        onChange={onChange}
        errors={errors}
        handleChange={handleChange}
      />
      <PricingSection
        values={values}
        onChange={onChange}
        errors={errors}
        handleChange={handleChange}
        categoryHasListedBy={categoryHasListedBy}
      />

      <FormSection
        icon={PHOTOS_ICON}
        title="Photos & Media"
        subtitle="Great photos attract more buyers"
      >
        <div className="cf-field">
          <ImageUploader
            images={values.images}
            onChange={(v) => onChange('images', v)}
          />
          {errors.images && <span className="cf-error">{errors.images}</span>}
        </div>
        <div className="cf-field">
          <label htmlFor="ad-videoUrl">
            Video link <span className="cf-optional">optional</span>
          </label>
          <input
            id="ad-videoUrl"
            className="cf-input"
            type="url"
            placeholder="Paste a YouTube or video URL"
            value={values.videoUrl || ''}
            onChange={handleChange('videoUrl')}
          />
        </div>
      </FormSection>

      <DeliverySection
        values={values}
        onChange={onChange}
        handleChange={handleChange}
      />

      <FormSection
        icon={LOCATION_ICON}
        title="Location & Availability"
        subtitle="Help buyers find items near them"
      >
        <div className="cf-field">
          <LocationSelector
            location={values.location}
            onChange={(v) => onChange('location', v)}
            error={errors.location}
          />
        </div>
        <div className="cf-field">
          <label htmlFor="ad-availableFrom">
            Available from <span className="cf-optional">optional</span>
          </label>
          <input
            id="ad-availableFrom"
            className="cf-input"
            type="date"
            value={values.availableFrom || ''}
            onChange={handleChange('availableFrom')}
            style={{ maxWidth: 240 }}
          />
        </div>
      </FormSection>

      <div className="cf-actions">
        <button
          className={`cf-btn cf-btn--primary${loading ? ' cf-btn--loading' : ''}`}
          type="button"
          onClick={onSubmit}
          disabled={anyLoading}
        >
          {loading ? SPINNER_ICON : CHECK_ICON}
          {loading ? 'Posting...' : submitLabel}
        </button>
        {onSaveDraft && (
          <button
            className={`cf-btn cf-btn--secondary${draftLoading ? ' cf-btn--loading' : ''}`}
            type="button"
            onClick={onSaveDraft}
            disabled={anyLoading}
          >
            {draftLoading ? SPINNER_ICON : SAVE_ICON}
            {draftLoading ? 'Saving...' : 'Save as draft'}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdForm;
