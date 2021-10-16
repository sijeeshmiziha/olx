import React from 'react';
import './Toast.css';

function Toast({ message, type = 'info', onClose }) {
  return (
    <div className={`toast toast_${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="toastClose"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;
