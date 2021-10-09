import React, { useState } from 'react';
import { STATES, getCitiesForState } from '../../data/locations';
import './LocationPicker.css';

function LocationPicker({ isOpen, onClose, onSelect, currentLocation }) {
  const [state, setState] = useState(currentLocation?.state || '');
  const [city, setCity] = useState(currentLocation?.city || '');

  const cities = getCitiesForState(state);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state && city) {
      onSelect({ state, city });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="locationPickerOverlay" onClick={onClose}>
      <div className="locationPickerModal" onClick={(e) => e.stopPropagation()}>
        <h3>Select your location</h3>
        <form onSubmit={handleSubmit}>
          <label>State</label>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity('');
            }}
            className="locationPickerSelect"
          >
            <option value="">Select state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label>City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="locationPickerSelect"
            disabled={!state}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="locationPickerActions">
            <button
              type="button"
              onClick={onClose}
              className="locationPickerBtn cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="locationPickerBtn submit"
              disabled={!state || !city}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocationPicker;
