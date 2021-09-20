import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { NotificationContext } from '../../contextStore/NotificationContext';
import { AuthContext } from '../../contextStore/AuthContext';
import './NotificationBell.css';

function NotificationBell() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead } =
    useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const ref = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
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

  if (!user) return null;

  const recent = notifications.slice(0, 8);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setOpen(false);
    if (notif.actionUrl) {
      history.push(notif.actionUrl);
    } else if (notif.data?.productId) {
      history.push(`/ad/${notif.data.productId}`);
    } else if (notif.data?.offerId) {
      history.push('/dashboard/offers');
    } else {
      history.push('/notifications');
    }
  };

  return (
    <div className="notificationBellWrap" ref={ref}>
      <button
        type="button"
        className="notificationBellBtn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <span className="notificationBellIcon">&#128276;</span>
        {unreadCount > 0 && (
          <span className="notificationBellBadge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="notificationBellDropdown">
          <div className="notificationBellDropdownHeader">
            <span>Notifications</span>
            <Link to="/notifications" onClick={() => setOpen(false)}>
              See all
            </Link>
          </div>
          <div className="notificationBellDropdownList">
            {recent.length === 0 ? (
              <p className="notificationBellEmpty">No notifications yet</p>
            ) : (
              recent.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  className={`notificationBellItem ${n.read ? '' : 'unread'} ${n.priority === 'high' ? 'notificationBellItemHigh' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  {n.imageUrl && (
                    <img src={n.imageUrl} alt="" className="notificationBellThumb" />
                  )}
                  <span className="notificationBellItemContent">
                    <strong>{n.title}</strong>
                    <span className="notificationBellItemBody">{n.body}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
