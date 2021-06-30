import React, { useState, useContext } from 'react';
import { LocationContext } from '../../contextStore/LocationContext';
import LocationPicker from '../Location/LocationPicker';
import './LocationBanner.css';

function LocationBanner() {
  const { browseLocation, setBrowseLocation } = useContext(LocationContext);
  const [pickerOpen, setPickerOpen] = useState(false);

  const label = browseLocation?.city
    ? browseLocation.city +
      (browseLocation.state ? `, ${browseLocation.state}` : '')
    : browseLocation?.state || null;

  return (
    <>
      <div className="locationBanner">
        {label ? (
          <>
            <span>
              Browsing in <strong>{label}</strong>
            </span>
            <button
              type="button"
              className="locationBannerBtn"
              onClick={() => setPickerOpen(true)}
            >
              Change
            </button>
          </>
        ) : (
          <button
            type="button"
            className="locationBannerBtn"
            onClick={() => setPickerOpen(true)}
          >
            Set your location to see nearby ads
          </button>
        )}
      </div>
      <LocationPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setBrowseLocation}
        currentLocation={browseLocation}
      />
    </>
  );
}

export default LocationBanner;
