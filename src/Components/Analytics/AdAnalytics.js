import React from 'react';
import './Analytics.css';

function AdAnalytics({ product }) {
  const stats = product?.stats || {};
  const views = Number(stats.views) || 0;
  const favorites = Number(stats.favorites) || 0;
  const messages = Number(stats.messages) || 0;
  const offers = Number(stats.offers) || 0;

  return (
    <div className="adAnalytics">
      <h3>Ad performance</h3>
      <div className="adAnalyticsGrid">
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{views}</span>
          <span className="adAnalyticsLabel">Views</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{favorites}</span>
          <span className="adAnalyticsLabel">Favorites</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{messages}</span>
          <span className="adAnalyticsLabel">Messages</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{offers}</span>
          <span className="adAnalyticsLabel">Offers</span>
        </div>
      </div>
    </div>
  );
}

export default AdAnalytics;
