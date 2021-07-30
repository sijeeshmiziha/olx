import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { savedSearchesRef } from '../../firebase/collections';
import { silentCatch } from '../../utils/errorHandler';
import { LinesSkeleton } from '../UI/Skeleton';
import '../Dashboard/Dashboard.css';

function SavedSearches() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setSearches([]);
      setLoading(false);
      return;
    }
    const unsub = savedSearchesRef()
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snap) => {
        setSearches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return () => unsub();
  }, [user?.uid]);

  const buildSearchUrl = (s) => {
    const params = new URLSearchParams();
    if (s.filters?.query) params.set('q', s.filters.query);
    if (s.filters?.category) params.set('category', s.filters.category);
    if (s.filters?.subcategory)
      params.set('subcategory', s.filters.subcategory);
    if (s.filters?.minPrice != null && s.filters.minPrice !== '')
      params.set('minPrice', s.filters.minPrice);
    if (s.filters?.maxPrice != null && s.filters.maxPrice !== '')
      params.set('maxPrice', s.filters.maxPrice);
    if (s.filters?.state) params.set('state', s.filters.state);
    if (s.filters?.city) params.set('city', s.filters.city);
    if (s.filters?.condition) params.set('condition', s.filters.condition);
    if (s.filters?.datePosted) params.set('datePosted', s.filters.datePosted);
    return `/search?${params.toString()}`;
  };

  const applySearch = (s) => {
    history.push(buildSearchUrl(s));
  };

  const deleteSearch = (id) => {
    savedSearchesRef()
      .doc(id)
      .delete()
      .catch(silentCatch('SavedSearches:deleteSearch'));
  };

  if (loading)
    return (
      <div className="savedSearchesPage">
        <h2>Saved searches</h2>
        <LinesSkeleton count={5} />
      </div>
    );

  return (
    <div className="savedSearchesPage">
      <h2>Saved searches</h2>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>
        Quick access to your saved filters. Click Apply to run the search.
      </p>
      {searches.length === 0 ? (
        <p className="emptyState">
          No saved searches. Save a search from the search results page.
        </p>
      ) : (
        <ul className="savedSearchesList">
          {searches.map((s) => (
            <li key={s.id} className="savedSearchItem">
              <div>
                <div className="savedSearchName">{s.name}</div>
                <div className="savedSearchMeta">
                  {s.filters?.query && `"${s.filters.query}"`}
                  {s.filters?.category && ` · ${s.filters.category}`}
                  {s.notifyOnNew && ' · Notifications on'}
                </div>
              </div>
              <div className="savedSearchActions">
                <button
                  type="button"
                  className="savedSearchApply"
                  onClick={() => applySearch(s)}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="savedSearchDelete"
                  onClick={() => deleteSearch(s.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedSearches;
