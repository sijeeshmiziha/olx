import React, { useState, useContext, useRef, useEffect } from 'react';
import { LocationContext } from '../../contextStore/LocationContext';
import { STATES, CITIES_BY_STATE } from '../../data/locations';
import './LocationDropdown.css';

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LocationDropdown() {
  const { browseLocation, setBrowseLocation } = useContext(LocationContext);
  const [open, setOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedState, setSelectedState] = useState(
    browseLocation?.state || ''
  );
  const [selectedCity, setSelectedCity] = useState(browseLocation?.city || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const displayLabel = browseLocation?.city
    ? browseLocation.state
      ? `${browseLocation.city}, ${browseLocation.state}`
      : browseLocation.city
    : browseLocation?.state || 'India';

  const filteredStates = stateQuery
    ? STATES.filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase()))
    : STATES;

  const citiesForState = selectedState
    ? CITIES_BY_STATE[selectedState] || []
    : [];
  const filteredCities = cityQuery
    ? citiesForState.filter((c) =>
        c.toLowerCase().includes(cityQuery.toLowerCase())
      )
    : citiesForState;

  const handleApply = () => {
    if (selectedState && selectedCity) {
      setBrowseLocation({ state: selectedState, city: selectedCity });
    } else if (selectedState) {
      setBrowseLocation({ state: selectedState, city: '' });
    }
    setOpen(false);
  };

  const handleClear = () => {
    setBrowseLocation({ state: '', city: '' });
    setSelectedState('');
    setSelectedCity('');
    setOpen(false);
  };

  return (
    <div className="locationDropdownWrap" ref={dropdownRef}>
      <button
        type="button"
        className="headerLocationBtn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="headerLocationIcon">
          <PinIcon />
        </span>
        <span className="headerLocationLabel">{displayLabel}</span>
        <span className="headerLocationArrow">▼</span>
      </button>
      {open && (
        <div className="locationDropdownPanel">
          <div className="locationDropdownSection">
            <label htmlFor="location-state-input">State</label>
            <input
              id="location-state-input"
              type="text"
              placeholder="Search state..."
              value={selectedState ? stateQuery || selectedState : stateQuery}
              onChange={(e) => {
                setStateQuery(e.target.value);
                if (!e.target.value) setSelectedState('');
              }}
            />
            <ul className="locationDropdownList">
              {filteredStates.slice(0, 8).map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className={selectedState === s ? 'selected' : ''}
                    onClick={() => {
                      setSelectedState(s);
                      setSelectedCity('');
                      setStateQuery('');
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selectedState && (
            <div className="locationDropdownSection">
              <label htmlFor="location-city-input">City</label>
              <input
                id="location-city-input"
                type="text"
                placeholder="Search city..."
                value={selectedCity ? cityQuery || selectedCity : cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  if (!e.target.value) setSelectedCity('');
                }}
              />
              <ul className="locationDropdownList">
                {filteredCities.slice(0, 8).map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className={selectedCity === c ? 'selected' : ''}
                      onClick={() => {
                        setSelectedCity(c);
                        setCityQuery('');
                      }}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="locationDropdownActions">
            <button
              type="button"
              className="locationDropdownClear"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="locationDropdownApply"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationDropdown;
