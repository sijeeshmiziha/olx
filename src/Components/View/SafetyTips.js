import React, { useState } from 'react';
import './ReportAd.css';

const TIPS = [
  'Meet the seller in a safe, public place.',
  'Check the item before you pay.',
  'Pay only after you receive the item.',
  'Never pay in advance or send money by wire.',
];

function SafetyTips() {
  const [open, setOpen] = useState(false);

  return (
    <div className="safetyTips">
      <button
        type="button"
        className="safetyTipsHeader"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h4>Safety tips for buyers</h4>
        <span className="safetyTipsToggle">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ul>
          {TIPS.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SafetyTips;
