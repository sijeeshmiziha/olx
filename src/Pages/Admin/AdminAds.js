import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import {
  getProductRef,
  productsRef,
  serverTimestamp,
} from '../../firebase/collections';

function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderationFilter, setModerationFilter] = useState('');

  useEffect(() => {
    let q = productsRef().orderBy('createdAt', 'desc').limit(100);
    if (moderationFilter) {
      q = productsRef()
        .where('moderationStatus', '==', moderationFilter)
        .orderBy('createdAt', 'desc')
        .limit(100);
    }
    q.get()
      .then((snap) => {
        setAds(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch((err) => {
        console.error('AdminAds fetch error:', err);
        setAds([]);
      })
      .finally(() => setLoading(false));
  }, [moderationFilter]);

  const updateModeration = (id, status) => {
    getProductRef(id)
      .update({ moderationStatus: status, updatedAt: serverTimestamp() })
      .then(() => {
        setAds((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, moderationStatus: status } : a
          )
        );
      });
  };

  return (
    <AdminLayout>
      <h1>Ads</h1>
      <div className="adminFilters">
        <label>Moderation: </label>
        <select
          value={moderationFilter}
          onChange={(e) => setModerationFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Moderation</th>
                <th>Reports</th>
                <th>User</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.category}</td>
                  <td>{a.status || 'active'}</td>
                  <td>{a.moderationStatus || 'approved'}</td>
                  <td>{a.reportCount || 0}</td>
                  <td>{a.userId}</td>
                  <td>
                    <Link
                      to={`/ad/${a.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    {(a.moderationStatus === 'pending' ||
                      a.moderationStatus === 'flagged') && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateModeration(a.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateModeration(a.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminAds;
