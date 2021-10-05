import React from 'react';
import { formatDate, getStatusBadge } from './VerificationHelpers';

export default function VerificationRequestCard({
  req,
  isExpanded,
  isActing,
  onToggleExpand,
  adminNote,
  onAdminNoteChange,
  onApprove,
  onReject,
  onRevoke,
  onDelete,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--olx-border, #e7e9e9)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 20px',
          cursor: 'pointer',
          flexWrap: 'wrap',
          width: '100%',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
        onClick={onToggleExpand}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#002f34' }}>{req.userName || 'Unknown User'}</div>
          <div style={{ fontSize: 13, color: '#7f9799', marginTop: 2 }}>{req.userEmail || '—'}</div>
        </div>
        <div>{getStatusBadge(req.status)}</div>
        <div style={{ fontSize: 12, color: '#999', minWidth: 140, textAlign: 'right' }}>{formatDate(req.createdAt)}</div>
        <span style={{ fontSize: 14, color: '#999', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>&#9660;</span>
      </button>

      {isExpanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--olx-border, #e7e9e9)' }}>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#002f34', display: 'block', marginBottom: 4 }}>Reason for verification</span>
            <p style={{ margin: 0, fontSize: 14, color: '#444', background: '#f7f9f9', padding: '10px 14px', borderRadius: 6, lineHeight: 1.5 }}>{req.reason || 'No reason provided.'}</p>
          </div>
          {req.idDocumentUrl && (
            <div style={{ marginTop: 16 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#002f34', display: 'block', marginBottom: 4 }}>ID Document</span>
              <a href={req.idDocumentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', maxWidth: 240, borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={req.idDocumentUrl} alt="ID document" style={{ width: '100%', display: 'block' }} />
              </a>
            </div>
          )}
          {(req.verificationType || req.documentType || req.selfieUrl || req.attempts != null) && (
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#666' }}>
              {req.verificationType && <span><strong>Type:</strong> {req.verificationType}</span>}
              {req.documentType && <span><strong>Document:</strong> {req.documentType}</span>}
              {req.attempts != null && <span><strong>Attempts:</strong> {req.attempts}</span>}
              {req.selfieUrl && <span><strong>Selfie:</strong> <a href={req.selfieUrl} target="_blank" rel="noopener noreferrer">View</a></span>}
            </div>
          )}
          {req.selfieUrl && (
            <div style={{ marginTop: 8 }}>
              <img src={req.selfieUrl} alt="Selfie" style={{ maxWidth: 120, borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
          )}
          <div style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: '#666' }}>
            <span><strong>User ID:</strong> <code style={{ fontSize: 12, background: '#f0f4f5', padding: '1px 6px', borderRadius: 3 }}>{req.userId}</code></span>
            {req.resolvedAt && <span><strong>Resolved:</strong> {formatDate(req.resolvedAt)}</span>}
            {req.reviewedBy && <span><strong>Reviewed by:</strong> {req.reviewedBy}</span>}
          </div>
          {req.adminNote && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}><strong>Admin note:</strong> {req.adminNote}</div>
          )}
          {req.status === 'pending' && (
            <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 16 }}>
              <label htmlFor={`admin-note-${req.id}`} style={{ fontWeight: 600, fontSize: 13, color: '#002f34', display: 'block', marginBottom: 6 }}>
                Admin note <span style={{ fontWeight: 400, color: '#999' }}>(required for rejection)</span>
              </label>
              <textarea
                id={`admin-note-${req.id}`}
                value={adminNote}
                onChange={(e) => onAdminNoteChange(req.id, e.target.value)}
                placeholder="Optional note for approval, required for rejection..."
                rows={2}
                style={{ width: '100%', padding: '8px 12px', border: '2px solid #e7e9e9', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button onClick={() => onApprove(req)} disabled={isActing} style={{ padding: '8px 20px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer', opacity: isActing ? 0.6 : 1, fontFamily: 'inherit' }}>
                  {isActing ? 'Processing...' : 'Approve'}
                </button>
                <button onClick={() => onReject(req)} disabled={isActing} style={{ padding: '8px 20px', background: '#fff', color: '#c62828', border: '2px solid #c62828', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer', opacity: isActing ? 0.6 : 1, fontFamily: 'inherit' }}>
                  {isActing ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          )}
          {req.status === 'approved' && (
            <div style={{ display: 'flex', gap: 10, marginTop: 20, borderTop: '1px solid #eee', paddingTop: 16 }}>
              <button onClick={() => onRevoke(req)} disabled={isActing} style={{ padding: '8px 20px', background: '#fff', color: '#c62828', border: '2px solid #c62828', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer', opacity: isActing ? 0.6 : 1, fontFamily: 'inherit' }}>
                {isActing ? 'Processing...' : 'Revoke verification'}
              </button>
            </div>
          )}
          {req.status === 'rejected' && (
            <div style={{ display: 'flex', gap: 10, marginTop: 20, borderTop: '1px solid #eee', paddingTop: 16 }}>
              <button onClick={() => onDelete(req)} disabled={isActing} style={{ padding: '8px 20px', background: '#fff', color: '#666', border: '1px solid #ccc', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer', opacity: isActing ? 0.6 : 1, fontFamily: 'inherit' }}>
                {isActing ? 'Deleting...' : 'Delete request'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
