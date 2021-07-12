import React from 'react';

export default function ProductDescription({ description, showReadMore, expanded, onToggle }) {
  const text = description || '';
  const short = text.length > 200 ? text.slice(0, 200) + '...' : text;

  return (
    <div className="productDescription">
      <p className="p-bold">Product Description</p>
      <p>
        {expanded || !showReadMore ? text : short}
        {showReadMore && (
          <button type="button" className="viewReadMore" onClick={onToggle}>
            {expanded ? '' : ' Read more'}
          </button>
        )}
      </p>
    </div>
  );
}
