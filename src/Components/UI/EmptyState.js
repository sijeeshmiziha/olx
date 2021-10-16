import React from 'react';
import './EmptyState.css';

function EmptyState({ title, message, action }) {
  return (
    <div className="emptyState">
      {title && <h3 className="emptyStateTitle">{title}</h3>}
      {message && <p className="emptyStateMessage">{message}</p>}
      {action && <div className="emptyStateAction">{action}</div>}
    </div>
  );
}

export default EmptyState;
