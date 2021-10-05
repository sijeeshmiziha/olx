import React from 'react';
import VerifiedBadge from '../../../Components/UI/VerifiedBadge';

export const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadge(status) {
  const styles = {
    pending: { background: '#fff8e1', color: '#f57f17', border: '#ffe082' },
    approved: { background: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
    rejected: { background: '#ffebee', color: '#c62828', border: '#ef9a9a' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: s.background,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {status === 'approved' && <VerifiedBadge size={13} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
