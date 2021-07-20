import React from 'react';
import PostCards from '../PostCards/PostCards';
import './SearchResults.css';

function SearchResults({ products, viewMode = 'grid' }) {
  if (!products || products.length === 0) {
    return (
      <div className="searchResultsEmpty">
        <p>No results found.</p>
        <p className="searchResultsEmptyHint">
          Try different keywords or filters.
        </p>
      </div>
    );
  }

  const className =
    viewMode === 'list' ? 'searchResultsList' : 'searchResultsGrid';
  return (
    <div className={className}>
      {products.map((product, index) => (
        <div className="searchResultCard" key={product.id || index}>
          <PostCards product={product} index={index} />
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
