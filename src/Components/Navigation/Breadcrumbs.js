import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * items: [{ label, to? }] - last item without "to" is current page
 */
function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="breadcrumbItem">
          {i > 0 && <span className="breadcrumbSep">›</span>}
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="breadcrumbCurrent">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
