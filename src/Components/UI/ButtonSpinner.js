import React from 'react';
import './ButtonSpinner.css';

function ButtonSpinner() {
  return (
    <span className="buttonSpinner" role="status" aria-hidden="true">
      <span className="buttonSpinnerCircle" />
    </span>
  );
}

export default ButtonSpinner;
