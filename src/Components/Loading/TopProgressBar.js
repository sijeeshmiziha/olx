import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TopProgressBar.css';

function TopProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="top-progress-bar" role="progressbar" aria-hidden="true">
      <div className="top-progress-bar-shimmer" />
    </div>
  );
}

export default TopProgressBar;
