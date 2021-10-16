import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modalTitle">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
