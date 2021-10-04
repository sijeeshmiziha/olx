import React from 'react';
import { categoriesRef } from '../../firebase/collections';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { useState, useEffect } from 'react';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesRef()
      .get()
      .then((snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Categories</h1>
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories in Firestore. Categories may be defined in app data (src/data/categories.js).</p>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminCategories;
