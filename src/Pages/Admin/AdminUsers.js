import React, { useState, useEffect } from 'react';
import { usersRef, getUserRef, serverTimestamp } from '../../firebase/collections';
import AdminLayout from '../../Components/Admin/AdminLayout';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let q = usersRef().limit(100);
    if (statusFilter) {
      q = usersRef().where('accountStatus', '==', statusFilter).limit(100);
    }
    q.get()
      .then((snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const setAccountStatus = (userId, accountStatus) => {
    getUserRef(userId).update({ accountStatus, updatedAt: serverTimestamp() }).then(() => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, accountStatus } : u)));
    });
  };

  return (
    <AdminLayout>
      <h1>Users</h1>
      <div className="adminFilters">
        <label>Account status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account</th>
                <th>KYC</th>
                <th>Trust</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role || 'user'}</td>
                  <td>{u.accountStatus || 'active'}</td>
                  <td>{u.kycStatus || '—'}</td>
                  <td>{u.trustScore ?? '—'}</td>
                  <td>
                    {(u.accountStatus === 'active' || !u.accountStatus) && (
                      <>
                        <button type="button" onClick={() => setAccountStatus(u.id, 'suspended')}>Suspend</button>
                        <button type="button" onClick={() => setAccountStatus(u.id, 'banned')}>Ban</button>
                      </>
                    )}
                    {u.accountStatus === 'suspended' && (
                      <button type="button" onClick={() => setAccountStatus(u.id, 'active')}>Reactivate</button>
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

export default AdminUsers;
