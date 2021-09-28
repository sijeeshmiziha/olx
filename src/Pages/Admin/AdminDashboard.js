import React, { useState, useEffect } from 'react';
import {
  usersRef,
  productsRef,
  reportsRef,
} from '../../firebase/collections';
import { silentCatch } from '../../utils/errorHandler';
import AdminLayout from '../../Components/Admin/AdminLayout';

function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, ads: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersRef().get().then((s) => s.size),
      productsRef().get().then((s) => s.size),
      reportsRef().get().then((s) => s.size),
    ])
      .then(([users, ads, reports]) => setCounts({ users, ads, reports }))
      .catch(silentCatch('AdminDashboard:loadCounts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="adminCards">
          <div className="adminCard">
            <h3>Users</h3>
            <p className="adminCardCount">{counts.users}</p>
          </div>
          <div className="adminCard">
            <h3>Ads</h3>
            <p className="adminCardCount">{counts.ads}</p>
          </div>
          <div className="adminCard">
            <h3>Reports</h3>
            <p className="adminCardCount">{counts.reports}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
