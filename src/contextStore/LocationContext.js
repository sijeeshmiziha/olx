import React, { createContext, useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'olx_browse_location';

export const LocationContext = createContext(null);

function getStored() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed && (parsed.city || parsed.state)) return parsed;
    }
  } catch (e) {}
  return { city: '', state: '' };
}

function saveStored(loc) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc || {}));
  } catch (e) {}
}

function ContextLocation({ children }) {
  const [location, setLocation] = useState(getStored);

  useEffect(() => {
    saveStored(location);
  }, [location]);

  const value = useMemo(
    () => ({ browseLocation: location, setBrowseLocation: setLocation }),
    [location]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export default ContextLocation;
