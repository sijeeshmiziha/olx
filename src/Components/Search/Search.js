import React from 'react';
import SearchIcon from '../../assets/SearchIcon';
import CloseIcon from '../../assets/CloseIcon/CloseIcon';
import { useHistory } from 'react-router';
import './search.css';
import { useSearchFilter } from '../../hooks/useSearchFilter';

function Search() {
  const history = useHistory();
  const {
    filteredData,
    wordEntered,
    handleFilter,
    clearInput,
    handleSelectedSearch,
  } = useSearchFilter({ filterByCategory: true });

  const handleSearchClick = () => {
    if (wordEntered.trim()) {
      history.push(`/search?q=${encodeURIComponent(wordEntered.trim())}`);
    } else {
      history.push('/search');
    }
  };
  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder="Find Cars,Mobile,Motorcycles and more..."
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          <div onClick={handleSearchClick}>
            {' '}
            <SearchIcon />{' '}
          </div>
          {filteredData.length !== 0 && (
            <div id="clearBtn" onClick={clearInput}>
              <CloseIcon />
            </div>
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <div
                key={key}
                className="dataItem"
                onClick={() => handleSelectedSearch(value)}
              >
                <p>{value.name} </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
