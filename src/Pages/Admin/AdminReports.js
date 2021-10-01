import React, { useState, useEffect } from 'react';
import { reportsRef } from '../../firebase/collections';
import AdminLayout from '../../Components/Admin/AdminLayout';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsRef()
      .limit(50)
      .get()
      .then((snap) => {
        setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Reports</h1>
      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No reports. (Reports collection may be create-only; add a composite index if needed.)</p>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Product ID</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.reporterId || r.userId || '-'}</td>
                  <td>{r.productId || '-'}</td>
                  <td>
                    {r.createdAt?.toDate?.()
                      ? r.createdAt.toDate().toLocaleString()
                      : '-'}
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

export default AdminReports;
