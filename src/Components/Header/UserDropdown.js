import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserRef } from '../../firebase/collections';
import VerifiedBadge from '../UI/VerifiedBadge';
import './UserDropdown.css';

function UserDropdown() {
  const { user } = React.useContext(AuthContext);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.displayName || 'Profile'
  );
  const [avatar, setAvatar] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const ref = useRef(null);

  // Read name + avatar from Firestore in real-time
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = getUserRef(user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const d = doc.data();
        if (d.name) setDisplayName(d.name);
        setAvatar(d.avatar || null);
        setIsVerified(d.verified === true);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  // Close on click/touch outside (supports both mouse and touch)
  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open, handleClickOutside]);

  // Lock body scroll when dropdown is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (open && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const logoutHandler = () => {
    Firebase.auth()
      .signOut()
      .then(() => {
        setOpen(false);
        history.push('/login');
      });
  };

  if (!user) return null;

  const initial = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <div className="userDropdownWrap" ref={ref}>
      <button
        type="button"
        className="headerUserBtn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="headerUserAvatar">
          {avatar ? (
            <img src={avatar} alt="" className="headerAvatarImg" />
          ) : (
            <span className="headerAvatarPlaceholder">{initial}</span>
          )}
        </span>
        <span className="headerUserName">
          {displayName}
          {isVerified && (
            <span className="headerVerifiedBadge" title="Verified">
              <VerifiedBadge size={14} />
            </span>
          )}
        </span>
        <span className="headerUserArrow">▼</span>
      </button>
      {open && (
        <>
          <div
            className="userDropdownOverlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="userDropdownPanel">
            <div className="userDropdownPanelInner">
              <Link
                to={`/profile/${user.uid}`}
                className="userDropdownProfileLink"
                onClick={() => setOpen(false)}
              >
                <div className="userDropdownProfileAvatar">
                  {avatar ? (
                    <img src={avatar} alt="" />
                  ) : (
                    <span className="userDropdownAvatarPlaceholder">
                      {initial}
                    </span>
                  )}
                </div>
                <div className="userDropdownProfileInfo">
                  <strong>
                    {displayName}
                    {isVerified && (
                      <span className="dropdownVerifiedBadge" title="Verified">
                        <VerifiedBadge size={14} />
                      </span>
                    )}
                  </strong>
                  <span className="userDropdownEmail">{user.email || ''}</span>
                  <span className="userDropdownEditHint">View my profile</span>
                </div>
                <span className="userDropdownProfileArrow">›</span>
              </Link>
              <nav className="userDropdownNav">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  My Ads
                </Link>
                <Link to="/messages/buying" onClick={() => setOpen(false)}>
                  Buy / Sell
                </Link>
                <Link to="/dashboard/saved" onClick={() => setOpen(false)}>
                  Favorites
                </Link>
                <Link to="/messages" onClick={() => setOpen(false)}>
                  Messages
                </Link>
                <Link to="/notifications" onClick={() => setOpen(false)}>
                  Notifications
                </Link>
                <Link to="/help" onClick={() => setOpen(false)}>
                  Help
                </Link>
                <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
                  Settings
                </Link>
              </nav>
              <button
                type="button"
                className="userDropdownLogout"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDropdown;
