import React from 'react';
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
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export default function CategorySection({
  values,
  onChange,
  errors,
  categoriesList,
  subcategoriesList,
  categoryFields,
  handleChange,
  handleExtraChange,
  extra,
}) {
  return (
    <FormSection
      icon={SECTION_ICON}
      title="Category & Details"
      subtitle="Choose the right category so buyers can find your ad"
    >
      <div className="cf-row">
        <div className="cf-field cf-field--half">
          <label htmlFor="ad-category">
            Category <span className="cf-req">*</span>
          </label>
          <select
            id="ad-category"
            name="category"
            value={values.category}
            onChange={(e) => {
              onChange('category', e.target.value);
              onChange('subcategory', '');
            }}
            className={`cf-input${errors.category ? ' cf-input--error' : ''}`}
          >
            <option value="">Select category</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="cf-error">{errors.category}</span>
          )}
        </div>
        {subcategoriesList.length > 0 && (
          <div className="cf-field cf-field--half">
            <label htmlFor="ad-subcategory">Subcategory</label>
            <select
              id="ad-subcategory"
              name="subcategory"
              value={values.subcategory}
              onChange={handleChange('subcategory')}
              className="cf-input"
            >
              <option value="">Select subcategory</option>
              {subcategoriesList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {categoryFields.length > 0 && (
        <div className="cf-category-details">
          <span className="cf-category-details-label">
            {values.category} details
          </span>
          <div className="cf-row cf-row--wrap">
            {categoryFields.map((f) => (
              <div key={f.key} className="cf-field cf-field--half">
                <label htmlFor={`ad-${f.key}`}>
                  {f.label}
                  {f.required && !f.label.includes('*') && (
                    <span className="cf-req"> *</span>
                  )}
                </label>
                {f.type === 'select' && (
                  <select
                    id={`ad-${f.key}`}
                    className={`cf-input${errors[`extra.${f.key}`] ? ' cf-input--error' : ''}`}
                    value={extra[f.key] || ''}
                    onChange={handleExtraChange(f.key)}
                  >
                    <option value="">
                      Select {f.label.replace(/\s*\*/, '').toLowerCase()}
                    </option>
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
                {f.type === 'checkbox' && (
                  <div className="cf-checkbox">
                    <input
                      id={`ad-${f.key}`}
                      type="checkbox"
                      checked={!!extra[f.key]}
                      onChange={handleExtraChange(f.key)}
                    />
                    <label htmlFor={`ad-${f.key}`}>
                      {f.label.replace(/\s*\*/, '')}
                    </label>
                  </div>
                )}
                {f.type !== 'select' && f.type !== 'checkbox' && (
                  <input
                    id={`ad-${f.key}`}
                    className={`cf-input${errors[`extra.${f.key}`] ? ' cf-input--error' : ''}`}
                    type={f.type}
                    value={extra[f.key] || ''}
                    onChange={handleExtraChange(f.key)}
                    placeholder={f.placeholder}
                    min={f.min}
                    max={f.max}
                  />
                )}
                {errors[`extra.${f.key}`] && (
                  <span className="cf-error">{errors[`extra.${f.key}`]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </FormSection>
  );
}
