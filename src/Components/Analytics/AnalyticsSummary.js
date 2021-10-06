import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contextStore/AuthContext';
import { Firebase } from '../../firebase/config';
import './Analytics.css';

function AnalyticsSummary() {
  const { user } = useContext(AuthContext);
  const [totals, setTotals] = useState({
    views: 0,
    favorites: 0,
    messages: 0,
    offers: 0,
  });

  useEffect(() => {
    if (!user?.uid) return;
    Firebase.firestore()
      .collection('products')
      .where('userId', '==', user.uid)
      .get()
      .then((snap) => {
        let views = 0,
          favorites = 0,
          messages = 0,
          offers = 0;
        snap.docs.forEach((doc) => {
          const s = doc.data().stats || {};
          views += Number(s.views) || 0;
          favorites += Number(s.favorites) || 0;
          messages += Number(s.messages) || 0;
          offers += Number(s.offers) || 0;
        });
        setTotals({ views, favorites, messages, offers });
      });
  }, [user?.uid]);

  return (
    <div className="analyticsSummary">
      <h3>Your ads overview</h3>
      <div className="adAnalyticsGrid">
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{totals.views}</span>
          <span className="adAnalyticsLabel">Total views</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{totals.favorites}</span>
          <span className="adAnalyticsLabel">Total favorites</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{totals.messages}</span>
          <span className="adAnalyticsLabel">Messages</span>
        </div>
        <div className="adAnalyticsCard">
          <span className="adAnalyticsValue">{totals.offers}</span>
          <span className="adAnalyticsLabel">Offers</span>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSummary;
