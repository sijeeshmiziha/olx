import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import {
  activityLogRef,
  offersRef,
  productsRef,
  transactionsRef,
  usersRef,
} from '../../firebase/collections';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    activeAds: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    totalOffers: 0,
    activityLogCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeCount = (query) =>
      query
        .get()
        .then((s) => s.size)
        .catch(() => 0);
    Promise.all([
      safeCount(usersRef()),
      safeCount(productsRef()),
      safeCount(productsRef().where('status', '==', 'active')),
      safeCount(transactionsRef()),
      safeCount(transactionsRef().where('status', '==', 'completed')),
      safeCount(offersRef()),
      activityLogRef()
        .limit(1)
        .get()
        .then(() => 0)
        .catch(() => 0),
    ])
      .then(
        ([
          totalUsers,
          totalAds,
          activeAds,
          totalTransactions,
          completedTransactions,
          totalOffers,
        ]) => {
          setStats({
            totalUsers,
            totalAds,
            activeAds,
            totalTransactions,
            completedTransactions,
            totalOffers,
            activityLogCount: '—',
          });
        }
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Analytics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="adminAnalyticsGrid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
            marginTop: 24,
          }}
        >
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Total users</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.totalUsers}
            </div>
          </div>
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Total ads</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.totalAds}
            </div>
          </div>
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Active ads</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.activeAds}
            </div>
          </div>
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Transactions</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.totalTransactions}
            </div>
            <div style={{ fontSize: 12, color: '#2e7d32' }}>
              {stats.completedTransactions} completed
            </div>
          </div>
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Offers</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {stats.totalOffers}
            </div>
          </div>
        </div>
      )}
      <p style={{ marginTop: 24, color: '#666', fontSize: 14 }}>
        View Firebase Console &gt; Analytics for user events and Performance for
        metrics.
      </p>
    </AdminLayout>
  );
}

export default AdminAnalytics;
