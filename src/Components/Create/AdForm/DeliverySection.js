import React from 'react';
import { CollapsibleSection } from './FormSection';
import { RETURN_POLICY_OPTIONS, PAYMENT_METHODS, CONTACT_PREFERENCE_OPTIONS } from './AdFormConstants';

const SECTION_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2 7 5.5 10.5 12 4" />
  </svg>
);

export default function DeliverySection({ values, onChange, handleChange }) {
  return (
    <CollapsibleSection icon={SECTION_ICON} title="Delivery, Warranty & Policies" subtitle="Optional — helps build buyer trust">
      <div className="cf-field">
        <div className="cf-checkbox">
          <input
            id="ad-delivery-available"
            type="checkbox"
            checked={Boolean(values.delivery?.available)}
            onChange={(e) => onChange('delivery', { ...(values.delivery || {}), available: e.target.checked })}
          />
          <label htmlFor="ad-delivery-available">Delivery available</label>
        </div>
        {values.delivery?.available && (
          <div className="cf-nested-fields">
            <div className="cf-row cf-row--wrap">
              <div className="cf-field cf-field--third">
                <label>Delivery type</label>
                <select className="cf-input" value={values.delivery?.type || 'pickup'} onChange={(e) => onChange('delivery', { ...values.delivery, type: e.target.value })}>
                  <option value="pickup">Pickup only</option>
                  <option value="delivery">Delivery</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="cf-field cf-field--third">
                <label>Shipping cost (₹)</label>
                <input className="cf-input" type="number" min="0" value={values.delivery?.shippingCost ?? ''} onChange={(e) => onChange('delivery', { ...values.delivery, shippingCost: Number(e.target.value) || 0 })} placeholder="0" />
              </div>
              <div className="cf-field cf-field--third">
                <label>Estimated days</label>
                <input className="cf-input" type="text" value={values.delivery?.estimatedDays || ''} onChange={(e) => onChange('delivery', { ...values.delivery, estimatedDays: e.target.value })} placeholder="e.g. 3-5 days" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="cf-divider" />
      <div className="cf-field">
        <div className="cf-checkbox">
          <input
            id="ad-warranty-available"
            type="checkbox"
            checked={Boolean(values.warranty?.available)}
            onChange={(e) => onChange('warranty', { ...(values.warranty || {}), available: e.target.checked })}
          />
          <label htmlFor="ad-warranty-available">Warranty available</label>
        </div>
        {values.warranty?.available && (
          <div className="cf-nested-fields">
            <div className="cf-row">
              <div className="cf-field cf-field--half">
                <label>Warranty type</label>
                <input className="cf-input" type="text" value={values.warranty?.type || ''} onChange={(e) => onChange('warranty', { ...values.warranty, type: e.target.value })} placeholder="e.g. Manufacturer warranty" />
              </div>
              <div className="cf-field cf-field--half">
                <label>Warranty details</label>
                <input className="cf-input" type="text" value={values.warranty?.description || ''} onChange={(e) => onChange('warranty', { ...values.warranty, description: e.target.value })} placeholder="e.g. 6 months remaining" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="cf-divider" />
      <div className="cf-field">
        <label htmlFor="ad-returnPolicy">Return policy</label>
        <select id="ad-returnPolicy" className="cf-input" value={values.returnPolicy || 'no_returns'} onChange={handleChange('returnPolicy')}>
          {RETURN_POLICY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="cf-divider" />
      <div className="cf-field">
        <label>Payment methods accepted</label>
        <div className="cf-chip-group">
          {PAYMENT_METHODS.map((pm) => {
            const checked = Array.isArray(values.paymentMethods) && values.paymentMethods.includes(pm.value);
            return (
              <button
                key={pm.value}
                type="button"
                className={`cf-chip ${checked ? 'cf-chip--active' : ''}`}
                onClick={() => {
                  const current = values.paymentMethods || [];
                  const next = checked ? current.filter((x) => x !== pm.value) : [...current, pm.value];
                  onChange('paymentMethods', next);
                }}
              >
                {checked && CHECK_ICON}
                {pm.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="cf-divider" />
      <div className="cf-field">
        <label>Buyers can contact you via</label>
        <div className="cf-chip-group">
          {CONTACT_PREFERENCE_OPTIONS.map((opt) => {
            const active = (values.contactPreference || 'both') === opt.value;
            return (
              <button key={opt.value} type="button" className={`cf-chip ${active ? 'cf-chip--active' : ''}`} onClick={() => onChange('contactPreference', opt.value)}>
                {active && CHECK_ICON}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </CollapsibleSection>
  );
}
