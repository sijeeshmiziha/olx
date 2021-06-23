import React from 'react';
import './Banner.css';

function Banner() {
  return (
    <div className="bannerParentDiv">
      <div className="bannerChildDiv">
        <div className="banner">
          <img
            src={`${process.env.PUBLIC_URL || ''}/assets/images/banner.png`}
            alt="OLX Banner"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
