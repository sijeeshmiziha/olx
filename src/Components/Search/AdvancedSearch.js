import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import SearchResults from './SearchResults';
import MapView from './MapView';
import SaveSearchModal from './SaveSearchModal';
import VoiceSearch from './VoiceSearch';
import MobileSearchBar from './MobileSearchBar';
import BarLoading from '../Loading/BarLoading';
import { filterAndSortProducts } from './searchUtils';
import './SearchResults.css';
import './SaveSearch.css';

export default function AdvancedSearch({
  products,
  loading,
  query,
  filters: initialFilters,
  onFiltersChange,
  onSortChange,
  viewMode: viewModeProp,
  onViewModeChange,
  onVoiceResult,
}) {
  const history = useHistory();
  const [filters, setFilters] = useState(initialFilters || {});
  const [sort, setSort] = useState(initialFilters?.sort || 'newest');
  const [viewMode, setViewModeState] = useState(viewModeProp || 'grid');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSearchText, setMobileSearchText] = useState(query || '');

  const setFiltersAndNotify = (next) => {
    setFilters(next);
    if (onFiltersChange) onFiltersChange(next, sort);
  };
  const setSortAndNotify = (next) => {
    setSort(next);
    if (onSortChange) onSortChange(next, filters);
  };
  const setViewMode = (mode) => {
    setViewModeState(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };

  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) setFilters(initialFilters);
    if (initialFilters?.sort) setSort(initialFilters.sort);
  }, [initialFilters]);

  useEffect(() => {
    setMobileSearchText(query || '');
  }, [query]);

  const handleMobileSearch = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = mobileSearchText.trim();
      if (trimmed) history.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [mobileSearchText, history]
  );

  const filteredByQuery = useMemo(() => {
    if (!products || !query || !query.trim()) return products || [];
    const q = query.trim().toLowerCase();
    return (products || []).filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [products, query]);

  const filteredAndSorted = useMemo(
    () => filterAndSortProducts(filteredByQuery, filters, sort),
    [filteredByQuery, filters, sort]
  );

  const locationText = [filters.city, filters.state].filter(Boolean).join(', ') || null;
  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== 'sort' && filters[k] !== '' && filters[k] !== false && filters[k] != null
  ).length;

  return (
    <div className="advancedSearchLayout">
      <MobileSearchBar
        query={query}
        mobileSearchText={mobileSearchText}
        onMobileSearchTextChange={setMobileSearchText}
        onMobileSearchSubmit={handleMobileSearch}
        sort={sort}
        onSortChange={setSortAndNotify}
        filters={filters}
        onFiltersChange={setFiltersAndNotify}
        mobileFiltersOpen={mobileFiltersOpen}
        onMobileFiltersOpenChange={setMobileFiltersOpen}
        activeFilterCount={activeFilterCount}
      />
      <aside className="advancedSearchSidebar">
        <FilterSidebar filters={filters} onChange={setFiltersAndNotify} />
      </aside>
      <div className="advancedSearchMain">
        <div className="searchResultsHeader">
          <span className="searchResultsCount">
            {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? 's' : ''}
            {query ? ` for "${query}"` : ''}
            {locationText ? ` in ${locationText}` : ''}
          </span>
          <div className="searchResultsHeaderRight">
            <div className="viewModeToggle">
              <button type="button" className={viewMode === 'grid' ? 'viewModeBtn active' : 'viewModeBtn'} onClick={() => setViewMode('grid')} aria-label="Grid view">⊞</button>
              <button type="button" className={viewMode === 'list' ? 'viewModeBtn active' : 'viewModeBtn'} onClick={() => setViewMode('list')} aria-label="List view">≡</button>
              <button type="button" className={viewMode === 'map' ? 'viewModeBtn active' : 'viewModeBtn'} onClick={() => setViewMode('map')} aria-label="Map view" title="Listings with location">📍</button>
            </div>
            {onVoiceResult && <VoiceSearch onResult={onVoiceResult} />}
            <button type="button" className="saveSearchBtn" onClick={() => setShowSaveModal(true)}>Save search</button>
            <SortDropdown value={sort} onChange={setSortAndNotify} />
          </div>
        </div>
        {loading ? (
          <BarLoading />
        ) : viewMode === 'map' ? (
          <MapView products={filteredAndSorted} />
        ) : (
          <SearchResults products={filteredAndSorted} viewMode={viewMode} />
        )}
      </div>
      {showSaveModal && (
        <SaveSearchModal query={query} filters={filters} onClose={() => setShowSaveModal(false)} onSuccess={() => setShowSaveModal(false)} />
      )}
    </div>
  );
}

export { filterAndSortProducts };
