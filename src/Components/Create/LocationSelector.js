import React, { useState } from 'react';
import { STATES, getCitiesForState } from '../../data/locations';
import { useGeolocation } from '../../hooks/useGeolocation';
import './LocationSelector.css';

function LocationSelector({ location, onChange, error }) {
  const loc = location || {};
  const city = loc.city || '';
  const state = loc.state || '';
  const pincode = loc.pincode || '';
  const cities = getCitiesForState(state);
  const [gettingLocation, setGettingLocation] = useState(false);
  const {
    lat,
    lng,
    loading: geoLoading,
    error: geoError,
    refresh,
  } = useGeolocation();
  const stateError = error && !state;
  const cityError = error && state && !city;

  const handleUseMyLocation = () => {
    setGettingLocation(true);
    refresh();
  };

  React.useEffect(() => {
    if (!gettingLocation || geoLoading || lat == null || lng == null) return;
    setGettingLocation(false);
    onChange({ ...loc, lat, lng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gettingLocation, geoLoading, lat, lng]);

  return (
    <div className="locationSelector">
      <div className="locationSelectorRow">
        <div className="locationFieldWrap">
          <label htmlFor="ad-location-state">
            State <span className="cf-req">*</span>
          </label>
          <select
            id="ad-location-state"
            value={state}
            onChange={(e) =>
              onChange({ ...loc, state: e.target.value, city: '' })
            }
            className={`input locationSelect${stateError ? ' cf-input--error' : ''}`}
          >
            <option value="">Select state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {stateError && (
            <span className="cf-error">Please select a state.</span>
          )}
        </div>
        <div className="locationFieldWrap">
          <label htmlFor="ad-location-city">
            City <span className="cf-req">*</span>
          </label>
          <select
            id="ad-location-city"
            value={city}
            onChange={(e) => onChange({ ...loc, city: e.target.value })}
            className={`input locationSelect${cityError ? ' cf-input--error' : ''}`}
            disabled={!state}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {cityError && <span className="cf-error">Please select a city.</span>}
        </div>
      </div>
      <input
        type="text"
        placeholder="Pincode (optional)"
        value={pincode}
        onChange={(e) => onChange({ ...loc, pincode: e.target.value })}
        className="input locationPincode"
        maxLength={6}
      />
      <button
        type="button"
        className="locationUseMyLocation"
        onClick={handleUseMyLocation}
        disabled={gettingLocation || geoLoading}
      >
        {gettingLocation || geoLoading
          ? 'Getting location...'
          : 'Use my location (for nearby ads)'}
      </button>
      {geoError && gettingLocation && (
        <span className="locationGeoError">{geoError}</span>
      )}
    </div>
  );
}

export default LocationSelector;
