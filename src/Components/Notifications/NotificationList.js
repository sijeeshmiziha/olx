import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { NotificationContext } from '../../contextStore/NotificationContext';
import './NotificationList.css';

function NotificationList() {
  const { notifications, markAsRead, markAllRead } =
    useContext(NotificationContext);
  const history = useHistory();

  const handleClick = (notif) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      history.push(notif.actionUrl);
    } else if (notif.data?.productId) {
      history.push(`/ad/${notif.data.productId}`);
    } else if (notif.data?.offerId) {
      history.push('/dashboard/offers');
    }
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return '';
    const d = typeof createdAt === 'number' ? new Date(createdAt) : createdAt;
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="notificationListPage">
      <div className="notificationListHeader">
        <h1>Notifications</h1>
        <Link to="/dashboard" className="notificationListBackLink">
          ← My OLX
        </Link>
        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            className="notificationListMarkAll"
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      <ul className="notificationList">
        {notifications.length === 0 ? (
          <li className="notificationListEmpty">No notifications yet.</li>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className={`notificationListItem ${n.read ? '' : 'unread'} ${n.priority === 'high' ? 'notificationPriorityHigh' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleClick(n)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(n)}
            >
              {n.imageUrl && (
                <img src={n.imageUrl} alt="" className="notificationListThumb" />
              )}
              <div className="notificationListItemContent">
                <strong>{n.title}</strong>
                <p>{n.body}</p>
                <span className="notificationListDate">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default NotificationList;
