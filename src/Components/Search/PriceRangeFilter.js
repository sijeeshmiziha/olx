import React from 'react';
import './FilterSidebar.css';

function PriceRangeFilter({ minPrice, maxPrice, onChange }) {
  return (
    <div className="filterGroup">
      <label>Price range</label>
      <div className="priceRangeInputs">
        <input
          type="number"
          placeholder="Min"
          value={minPrice || ''}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : '', maxPrice)
          }
          className="filterInput"
          min={0}
        />
        <span className="priceRangeSep">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice || ''}
          onChange={(e) =>
            onChange(minPrice, e.target.value ? Number(e.target.value) : '')
          }
          className="filterInput"
          min={0}
        />
      </div>
    </div>
  );
}

export default PriceRangeFilter;
