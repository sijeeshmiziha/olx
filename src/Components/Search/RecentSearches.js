import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { getRecentSearches, clearRecentSearches } from '../../utils/recentSearches';
import './RecentSearches.css';

function RecentSearches() {
  const { user } = useContext(AuthContext);
  const [recent, setRecent] = useState(() => getRecentSearches(user?.uid));

  if (recent.length === 0) return null;

  const handleClear = () => {
    clearRecentSearches(user?.uid);
    setRecent([]);
  };

  return (
    <div className="recentSearchesBlock">
      <div className="recentSearchesHeader">
        <h3 className="recentSearchesTitle">Recent searches</h3>
        <button
          type="button"
          className="recentSearchesClearBtn"
          onClick={handleClear}
        >
          Clear all
        </button>
      </div>
      <ul className="recentSearchesList">
        {recent.map((q) => (
          <li key={q}>
            <Link to={`/search?q=${encodeURIComponent(q)}`} className="recentSearchesLink">
              {q}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSearches;
