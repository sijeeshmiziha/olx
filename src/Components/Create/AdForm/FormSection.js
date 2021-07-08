import React, { useState } from 'react';

export function FormSection({ icon, title, subtitle, children, className = '' }) {
  return (
    <div className={`cf-section ${className}`}>
      <div className="cf-section-header">
        <div className="cf-section-icon">{icon}</div>
        <div>
          <h3 className="cf-section-title">{title}</h3>
          {subtitle && <p className="cf-section-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="cf-section-body">{children}</div>
    </div>
  );
}

export function CollapsibleSection({ icon, title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`cf-section cf-section--collapsible ${open ? 'cf-section--open' : ''}`}>
      <button type="button" className="cf-section-header cf-section-toggle" onClick={() => setOpen((p) => !p)}>
        <div className="cf-section-icon">{icon}</div>
        <div className="cf-section-toggle-text">
          <h3 className="cf-section-title">{title}</h3>
          {subtitle && <p className="cf-section-subtitle">{subtitle}</p>}
        </div>
        <svg className={`cf-chevron ${open ? 'cf-chevron--open' : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 8 10 12 14 8" />
        </svg>
      </button>
      {open && <div className="cf-section-body">{children}</div>}
    </div>
  );
}
