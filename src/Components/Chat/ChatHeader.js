import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Chat.css';

function ChatHeader({ product, otherUserName, otherUserId, otherUserAvatar }) {
  const history = useHistory();

  const handleBack = (e) => {
    e.preventDefault();
    // If there's history, go back; otherwise navigate to messages
    if (window.history.length > 1) { // eslint-disable-line no-restricted-globals
      history.goBack();
    } else {
      history.push('/messages');
    }
  };

  return (
    <div className="chatHeader">
      <a href="/messages" className="chatHeaderBack" onClick={handleBack} aria-label="Back to messages">
        ←
      </a>

      {otherUserId && (
        <Link to={`/profile/${otherUserId}`} className="chatHeaderProfile">
          <div className="chatHeaderAvatar">
            {otherUserAvatar ? (
              <img src={otherUserAvatar} alt={otherUserName || 'User'} />
            ) : (
              <span>{(otherUserName || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="chatHeaderInfo">
            {otherUserName && (
              <span className="chatHeaderUser">{otherUserName}</span>
            )}
            {product && (
              <span className="chatHeaderProduct">{product.name}</span>
            )}
          </div>
          <span className="chatHeaderProfileArrow">›</span>
        </Link>
      )}

      {!otherUserId && (
        <div className="chatHeaderInfo">
          {product && <span className="chatHeaderProduct">{product.name}</span>}
          {otherUserName && (
            <span className="chatHeaderUser">with {otherUserName}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatHeader;
