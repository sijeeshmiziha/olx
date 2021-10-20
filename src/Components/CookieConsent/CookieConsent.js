import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const STORAGE_KEY = 'olx_cookie_consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch (_) {}
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch (_) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookieConsent" role="dialog" aria-label="Cookie consent">
      <p>
        We use cookies to improve your experience. By continuing you agree to our{' '}
        <Link to="/legal">Privacy Policy</Link> and use of cookies.
      </p>
      <button type="button" className="cookieConsentBtn" onClick={accept}>
        Accept
      </button>
    </div>
  );
}

export default CookieConsent;
