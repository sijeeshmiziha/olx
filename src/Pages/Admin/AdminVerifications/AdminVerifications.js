import React, { useState, useContext } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { ToastContext } from '../../../contextStore/ToastContext';
import { TABS } from './VerificationHelpers';
import { useVerificationRequests } from './useVerificationRequests';
import { useVerificationActions } from './useVerificationActions';
import VerificationRequestCard from './VerificationRequestCard';

export default function AdminVerifications() {
  const { addToast } = useContext(ToastContext);
  const [activeTab, setActiveTab] = useState('pending');

  const { requests, loading } = useVerificationRequests(activeTab);
  const {
    actionLoading,
    expandedId,
    setExpandedId,
    handleApprove,
    handleReject,
    handleRevoke,
    handleDelete,
    getAdminNote,
    setAdminNote,
  } = useVerificationActions(addToast);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Verification Requests</h1>
        {activeTab === 'pending' && pendingCount > 0 && (
          <span style={{ background: '#f57f17', color: '#fff', borderRadius: 12, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{pendingCount}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              border: '1px solid',
              borderColor: activeTab === tab.key ? 'var(--olx-primary, #002f34)' : 'var(--olx-border, #e7e9e9)',
              borderRadius: 6,
              background: activeTab === tab.key ? 'var(--olx-primary, #002f34)' : '#fff',
              color: activeTab === tab.key ? '#fff' : 'var(--olx-text, #002f34)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading verification requests...</p>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 8, border: '1px solid var(--olx-border, #e7e9e9)', color: '#7f9799' }}>
          <p style={{ fontSize: 16, margin: 0 }}>No {activeTab !== 'all' ? activeTab : ''} verification requests.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {requests.map((req) => (
            <VerificationRequestCard
              key={req.id}
              req={req}
              isExpanded={expandedId === req.id}
              isActing={actionLoading === req.id}
              onToggleExpand={() => setExpandedId(expandedId === req.id ? null : req.id)}
              adminNote={getAdminNote(req.id)}
              onAdminNoteChange={setAdminNote}
              onApprove={handleApprove}
              onReject={handleReject}
              onRevoke={handleRevoke}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
