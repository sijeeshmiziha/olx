import React from 'react';
import { CONDITIONS } from '../../../data/categories';
import {
  AD_TYPE_OPTIONS,
  LISTED_BY_OPTIONS,
  PRICE_TYPE_OPTIONS,
} from './AdFormConstants';
import { FormSection } from './FormSection';

const SECTION_ICON = (
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
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default function PricingSection({
  values,
  onChange,
  errors,
  handleChange,
  categoryHasListedBy,
}) {
  return (
    <FormSection
      icon={SECTION_ICON}
      title="Pricing"
      subtitle="Set a competitive price for your item"
    >
      <div className="cf-row">
        <div className="cf-field cf-field--half">
          <label htmlFor="ad-adType">Ad type</label>
          <select
            id="ad-adType"
            className="cf-input"
            value={values.adType || 'for_sale'}
            onChange={handleChange('adType')}
          >
            {AD_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="cf-field cf-field--half">
          <label htmlFor="ad-priceType">Price type</label>
          <select
            id="ad-priceType"
            className="cf-input"
            value={values.priceType || 'fixed'}
            onChange={(e) => {
              const v = e.target.value;
              onChange('priceType', v);
              onChange('negotiable', v === 'negotiable');
            }}
          >
            {PRICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="cf-field">
        <label htmlFor="ad-price">
          Price <span className="cf-req">*</span>
        </label>
        <div className="cf-price-input-wrap">
          <span className="cf-price-symbol">₹</span>
          <input
            id="ad-price"
            className={`cf-input cf-input--price${errors.price ? ' cf-input--error' : ''}`}
            type="number"
            name="price"
            placeholder="0"
            min="0"
            value={values.price}
            onChange={handleChange('price')}
          />
        </div>
        {errors.price && <span className="cf-error">{errors.price}</span>}
        <div className="cf-checkbox" style={{ marginTop: 10 }}>
          <input
            id="ad-negotiable"
            type="checkbox"
            checked={values.negotiable}
            onChange={handleChange('negotiable')}
          />
          <label htmlFor="ad-negotiable">Price is negotiable</label>
        </div>
      </div>
      <div className="cf-row">
        <div className="cf-field cf-field--half">
          <label htmlFor="ad-condition">
            Condition <span className="cf-req">*</span>
          </label>
          <select
            id="ad-condition"
            className={`cf-input${errors.condition ? ' cf-input--error' : ''}`}
            value={values.condition}
            onChange={handleChange('condition')}
          >
            <option value="">Select condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.condition && (
            <span className="cf-error">{errors.condition}</span>
          )}
        </div>
        {!categoryHasListedBy && (
          <div className="cf-field cf-field--half">
            <label htmlFor="ad-listedBy">Listed by</label>
            <select
              id="ad-listedBy"
              className="cf-input"
              value={values.listedBy || ''}
              onChange={handleChange('listedBy')}
            >
              <option value="">Select</option>
              {LISTED_BY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </FormSection>
  );
}
