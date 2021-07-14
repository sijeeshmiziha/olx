import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;
  return (
    <div className="confirmModalOverlay" onClick={onCancel}>
      <div className="confirmModalBox" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirmModalTitle">{title}</h3>
        <p className="confirmModalMessage">{message}</p>
        <div className="confirmModalActions">
          <button
            type="button"
            className="confirmModalBtn cancel"
            onClick={onCancel}
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            className="confirmModalBtn confirm"
            onClick={onConfirm}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
