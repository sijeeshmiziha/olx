import React from 'react';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';

export default function MobileSearchBar({
  query,
  mobileSearchText,
  onMobileSearchTextChange,
  onMobileSearchSubmit,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  mobileFiltersOpen,
  onMobileFiltersOpenChange,
  activeFilterCount,
}) {
  return (
    <>
      <div className="mobileSearchBar">
        <form className="mobileSearchForm" onSubmit={onMobileSearchSubmit}>
          <svg className="mobileSearchIcon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#666" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="#666" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="mobileSearchInput"
            placeholder="Search for anything..."
            value={mobileSearchText}
            onChange={(e) => onMobileSearchTextChange(e.target.value)}
            autoFocus={!query}
          />
          {mobileSearchText && (
            <button type="button" className="mobileSearchClear" onClick={() => onMobileSearchTextChange('')} aria-label="Clear search">
              &times;
            </button>
          )}
          <button type="submit" className="mobileSearchSubmit" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <div className="mobileSearchActions">
          <button
            type="button"
            className={`mobileFilterToggle ${mobileFiltersOpen ? 'active' : ''}`}
            onClick={() => onMobileFiltersOpenChange(!mobileFiltersOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
          <SortDropdown value={sort} onChange={onSortChange} />
        </div>
      </div>
      {mobileFiltersOpen && (
        <div className="mobileFilterDrawer">
          <div className="mobileFilterDrawerHeader">
            <span className="mobileFilterDrawerTitle">Filters</span>
            <button type="button" className="mobileFilterDrawerClose" onClick={() => onMobileFiltersOpenChange(false)}>&times;</button>
          </div>
          <FilterSidebar filters={filters} onChange={onFiltersChange} />
        </div>
      )}
    </>
  );
}
