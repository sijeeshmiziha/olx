import React from 'react';
import { getCategoriesSorted, getSubcategories } from '../../data/categories';
import { CONDITIONS } from '../../data/categories';
import { STATES, getCitiesForState } from '../../data/locations';
import PriceRangeFilter from './PriceRangeFilter';
import RecentSearches from './RecentSearches';
import './FilterSidebar.css';

function FilterSidebar({ filters, onChange }) {
  const categoriesList = getCategoriesSorted();
  const subcategoriesList = getSubcategories(filters.category);

  return (
    <div className="filterSidebar">
      <RecentSearches />
      <h3 className="filterSidebarTitle">Filters</h3>

      <div className="filterGroup">
        <label>Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value, subcategory: '' })
          }
          className="filterSelect"
        >
          <option value="">All</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {subcategoriesList.length > 0 && (
        <div className="filterGroup">
          <label>Subcategory</label>
          <select
            value={filters.subcategory || ''}
            onChange={(e) =>
              onChange({ ...filters, subcategory: e.target.value })
            }
            className="filterSelect"
          >
            <option value="">All</option>
            {subcategoriesList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={(minPrice, maxPrice) =>
          onChange({ ...filters, minPrice, maxPrice })
        }
      />

      <div className="filterGroup">
        <label>Location - State</label>
        <select
          value={filters.state || ''}
          onChange={(e) =>
            onChange({ ...filters, state: e.target.value, city: '' })
          }
          className="filterSelect"
        >
          <option value="">All</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filters.state && (
        <div className="filterGroup">
          <label>City</label>
          <select
            value={filters.city || ''}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            className="filterSelect"
          >
            <option value="">All</option>
            {getCitiesForState(filters.state).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="filterGroup">
        <label>Condition</label>
        <select
          value={filters.condition || ''}
          onChange={(e) => onChange({ ...filters, condition: e.target.value })}
          className="filterSelect"
        >
          <option value="">All</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filterGroup">
        <label>Ad type</label>
        <select
          value={filters.adType || ''}
          onChange={(e) => onChange({ ...filters, adType: e.target.value })}
          className="filterSelect"
        >
          <option value="">All</option>
          <option value="for_sale">For Sale</option>
          <option value="for_rent">For Rent</option>
          <option value="wanted">Wanted</option>
          <option value="exchange">Exchange</option>
          <option value="free">Free</option>
        </select>
      </div>

      <div className="filterGroup">
        <label>
          <input
            type="checkbox"
            checked={!!filters.deliveryAvailable}
            onChange={(e) => onChange({ ...filters, deliveryAvailable: e.target.checked })}
          />
          Delivery available
        </label>
      </div>

      <div className="filterGroup">
        <label>
          <input
            type="checkbox"
            checked={!!filters.warrantyAvailable}
            onChange={(e) => onChange({ ...filters, warrantyAvailable: e.target.checked })}
          />
          Warranty available
        </label>
      </div>

      <div className="filterGroup">
        <label>
          <input
            type="checkbox"
            checked={!!filters.verifiedSeller}
            onChange={(e) => onChange({ ...filters, verifiedSeller: e.target.checked })}
          />
          Verified seller only
        </label>
      </div>

      <div className="filterGroup">
        <label>Date posted</label>
        <select
          value={filters.datePosted || ''}
          onChange={(e) => onChange({ ...filters, datePosted: e.target.value })}
          className="filterSelect"
        >
          <option value="">Any time</option>
          <option value="today">Today</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSidebar;
