import React from 'react';
import './OverlaySpinner.css';

function OverlaySpinner() {
  return (
    <div className="overlay-spinner" role="status" aria-label="Loading">
      <div className="overlay-spinner-circle" />
    </div>
  );
}

export default OverlaySpinner;
