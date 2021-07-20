import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import AdvancedSearch from '../Components/Search/AdvancedSearch';
import { Firebase } from '../firebase/config';
import { AuthContext } from '../contextStore/AuthContext';
import { addRecentSearch } from '../utils/recentSearches';

function getInitialFilters(search) {
  const p = new URLSearchParams(search);
  const filters = {};
  if (p.get('category')) filters.category = p.get('category');
  if (p.get('subcategory')) filters.subcategory = p.get('subcategory');
  if (p.get('minPrice') !== null && p.get('minPrice') !== '')
    filters.minPrice = p.get('minPrice');
  if (p.get('maxPrice') !== null && p.get('maxPrice') !== '')
    filters.maxPrice = p.get('maxPrice');
  if (p.get('state')) filters.state = p.get('state');
  if (p.get('city')) filters.city = p.get('city');
  if (p.get('condition')) filters.condition = p.get('condition');
  if (p.get('datePosted')) filters.datePosted = p.get('datePosted');
  if (p.get('adType')) filters.adType = p.get('adType');
  if (p.get('deliveryAvailable') === 'true') filters.deliveryAvailable = true;
  if (p.get('warrantyAvailable') === 'true') filters.warrantyAvailable = true;
  if (p.get('verifiedSeller') === 'true') filters.verifiedSeller = true;
  if (p.get('sort')) filters.sort = p.get('sort');
  return filters;
}

function buildSearchString(query, filters, sort) {
  const p = new URLSearchParams();
  if (query) p.set('q', query);
  if (filters?.category) p.set('category', filters.category);
  if (filters?.subcategory) p.set('subcategory', filters.subcategory);
  if (filters?.minPrice !== null && filters?.minPrice !== undefined && filters.minPrice !== '')
    p.set('minPrice', filters.minPrice);
  if (filters?.maxPrice !== null && filters?.maxPrice !== undefined && filters.maxPrice !== '')
    p.set('maxPrice', filters.maxPrice);
  if (filters?.state) p.set('state', filters.state);
  if (filters?.city) p.set('city', filters.city);
  if (filters?.condition) p.set('condition', filters.condition);
  if (filters?.datePosted) p.set('datePosted', filters.datePosted);
  if (filters?.adType) p.set('adType', filters.adType);
  if (filters?.deliveryAvailable) p.set('deliveryAvailable', 'true');
  if (filters?.warrantyAvailable) p.set('warrantyAvailable', 'true');
  if (filters?.verifiedSeller) p.set('verifiedSeller', 'true');
  if (sort && sort !== 'newest') p.set('sort', sort);
  return p.toString();
}

function SearchResultsPage() {
  const location = useLocation();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || '';
  const initialFilters = React.useMemo(
    () => getInitialFilters(location.search),
    [location.search]
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const syncUrl = useCallback(
    (filters, sort) => {
      const search = buildSearchString(q, filters, sort);
      const newPath = search
        ? `${location.pathname}?${search}`
        : location.pathname;
      if (newPath !== location.pathname + (location.search || '')) {
        history.replace(newPath);
      }
    },
    [q, location.pathname, location.search, history]
  );

  const handleFiltersChange = useCallback(
    (filters, sort) => {
      syncUrl(filters, sort || 'newest');
    },
    [syncUrl]
  );

  const handleSortChange = useCallback(
    (sort, filters) => {
      syncUrl(filters || initialFilters, sort);
    },
    [syncUrl, initialFilters]
  );

  useEffect(() => {
    if (q?.trim()) addRecentSearch(q, user?.uid);
  }, [q, user]);

  useEffect(() => {
    setLoading(true);
    Firebase.firestore()
      .collection('products')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVoiceResult = useCallback(
    (text) => {
      if (text?.trim()) {
        history.push(`/search?q=${encodeURIComponent(text.trim())}`);
      }
    },
    [history]
  );

  return (
    <Layout>
      <AdvancedSearch
        products={products}
        loading={loading}
        query={q}
        filters={initialFilters}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onVoiceResult={handleVoiceResult}
      />
    </Layout>
  );
}

export default SearchResultsPage;
