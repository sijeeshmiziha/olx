import React from 'react';
import './SortDropdown.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Date: Newest first' },
  { value: 'oldest', label: 'Date: Oldest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'relevance', label: 'Relevance' },
];

function SortDropdown({ value, onChange }) {
  return (
    <div className="sortDropdown">
      <label>Sort by</label>
      <select
        value={value || 'newest'}
        onChange={(e) => onChange(e.target.value)}
        className="sortSelect"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortDropdown;
export { SORT_OPTIONS };
