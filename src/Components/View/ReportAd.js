import React, { useState, useContext } from 'react';
import { reportsRef, serverTimestamp } from '../../firebase/collections';
import { ToastContext } from '../../contextStore/ToastContext';
import { canProceed, RATE_LIMITS } from '../../utils/rateLimit';
import './ReportAd.css';

const REPORT_REASONS = [
  'Spam',
  'Inappropriate content',
  'Fraud or scam',
  'Prohibited item',
  'Other',
];

function ReportAd({ productId, reporterId, onClose }) {
  const { addToast } = useContext(ToastContext);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || !reporterId || !productId) return;
    if (!canProceed('report', RATE_LIMITS.REPORT_MS)) {
      addToast('Please wait before submitting another report.', 'info');
      return;
    }
    setSubmitting(true);
    const reportId = `${reporterId}_${productId}`;
    reportsRef()
      .doc(reportId)
      .set({
        productId,
        reporterId,
        reason,
        description: description.trim() || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      .then(() => {
        addToast('Report submitted. Thank you.', 'success');
        onClose();
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="reportAdOverlay" onClick={onClose}>
      <div className="reportAdModal" onClick={(e) => e.stopPropagation()}>
        <h3>Report this ad</h3>
        <form onSubmit={handleSubmit}>
          <label>Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reportAdSelect"
            required
          >
            <option value="">Select a reason</option>
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label>Additional details (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="reportAdTextarea"
            rows={3}
            placeholder="Describe the issue..."
          />
          <div className="reportAdActions">
            <button
              type="button"
              onClick={onClose}
              className="reportAdBtn cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="reportAdBtn submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportAd;
