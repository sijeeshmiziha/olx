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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function DetailsSection({
  values,
  onChange,
  errors,
  handleChange,
}) {
  return (
    <FormSection
      icon={SECTION_ICON}
      title="Title & Description"
      subtitle="Write a clear, detailed title and description"
    >
      <div className="cf-field">
        <label htmlFor="ad-name">
          Ad title <span className="cf-req">*</span>
        </label>
        <input
          id="ad-name"
          className={`cf-input${errors.name ? ' cf-input--error' : ''}`}
          type="text"
          placeholder="e.g. iPhone 15 Pro Max 256GB — Excellent condition"
          name="name"
          maxLength={70}
          value={values.name}
          onChange={handleChange('name')}
        />
        <div className="cf-field-footer">
          <span className="cf-hint">
            Mention brand, model, age, and condition
          </span>
          <span className="cf-char-count">{(values.name || '').length}/70</span>
        </div>
        {errors.name && <span className="cf-error">{errors.name}</span>}
      </div>
      <div className="cf-field">
        <label htmlFor="ad-description">
          Description <span className="cf-req">*</span>
        </label>
        <textarea
          id="ad-description"
          className={`cf-input cf-textarea${errors.description ? ' cf-input--error' : ''}`}
          name="description"
          placeholder="Include condition, features, reason for selling..."
          value={values.description}
          onChange={handleChange('description')}
          rows={5}
          maxLength={4096}
        />
        <div className="cf-field-footer">
          <span className="cf-hint">
            The more detail, the more interest you'll get
          </span>
          <span className="cf-char-count">
            {(values.description || '').length}/4096
          </span>
        </div>
        {errors.description && (
          <span className="cf-error">{errors.description}</span>
        )}
      </div>
      <div className="cf-field">
        <label htmlFor="ad-tags">
          Tags <span className="cf-optional">optional</span>
        </label>
        <input
          id="ad-tags"
          className="cf-input"
          type="text"
          placeholder="e.g. iphone, 128gb, black — separate with commas"
          value={
            Array.isArray(values.tags)
              ? values.tags.join(', ')
              : values.tags || ''
          }
          onChange={(e) => {
            const raw = e.target.value || '';
            const tags = raw
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
            onChange('tags', tags);
          }}
        />
      </div>
    </FormSection>
  );
}
