import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const NAV = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/ads', label: 'Ads' },
  { path: '/admin/verifications', label: 'Verifications' },
  { path: '/admin/reports', label: 'Reports' },
  { path: '/admin/categories', label: 'Categories' },
  { path: '/admin/analytics', label: 'Analytics' },
];

function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="adminLayout">
      <aside className="adminSidebar">
        <h2 className="adminSidebarTitle">Admin</h2>
        <nav className="adminNav">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`adminNavLink ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="adminBackLink">← Back to site</Link>
      </aside>
      <main className="adminMain">{children}</main>
    </div>
  );
}

export default AdminLayout;
