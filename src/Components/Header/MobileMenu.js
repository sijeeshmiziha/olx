import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import OlxLogo from '../../assets/OlxLogo';
import './MobileMenu.css';

function MobileMenu({ open, onClose }) {
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="mobileMenuOverlay" onClick={onClose} aria-hidden="true" />
      <div className="mobileMenuDrawer">
        <div className="mobileMenuHeader">
          <Link to="/" onClick={onClose}>
            <OlxLogo />
          </Link>
          <button
            type="button"
            className="mobileMenuClose"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="mobileMenuNav">
          <Link to="/" onClick={onClose}>
            Home
          </Link>
          <Link to="/search" onClick={onClose}>
            Search
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={onClose}>
                My OLX
              </Link>
              <Link to="/dashboard/saved" onClick={onClose}>
                Favorites
              </Link>
              <Link to="/messages" onClick={onClose}>
                Messages
              </Link>
              <Link to="/messages/buying" onClick={onClose}>
                Buy / Sell
              </Link>
              <Link to="/notifications" onClick={onClose}>
                Notifications
              </Link>
              <Link to={`/profile/${user.uid}`} onClick={onClose}>
                Profile
              </Link>
              <Link to="/profile/edit" onClick={onClose}>
                Settings
              </Link>
            </>
          ) : (
            <Link to="/login" onClick={onClose}>
              Login
            </Link>
          )}
          <Link to="/create" onClick={onClose} className="mobileMenuSell">
            + SELL
          </Link>
        </nav>
      </div>
    </>
  );
}

export default MobileMenu;
