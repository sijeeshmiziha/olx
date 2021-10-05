import { useState } from 'react';
import { Firebase } from '../../../firebase/config';
import { verificationsRef, getUserRef, serverTimestamp } from '../../../firebase/collections';

export function useVerificationActions(addToast) {
  const [actionLoading, setActionLoading] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const getReviewedBy = () => Firebase.auth().currentUser?.uid || null;

  const handleApprove = async (req) => {
    if (actionLoading) return;
    setActionLoading(req.id);
    try {
      const batch = Firebase.firestore().batch();
      const verificationDocRef = verificationsRef().doc(req.id);
      batch.update(verificationDocRef, {
        status: 'approved',
        resolvedAt: serverTimestamp(),
        adminNote: (adminNotes[req.id] || '').trim(),
        reviewedAt: serverTimestamp(),
        reviewedBy: getReviewedBy(),
      });
      const userDocRef = getUserRef(req.userId);
      batch.update(userDocRef, { verified: true });
      await batch.commit();
      setAdminNotes((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
      setExpandedId(null);
    } catch (err) {
      console.error('Failed to approve verification:', err);
      addToast('Failed to approve. Check console for details.', 'error');
    }
    setActionLoading(null);
  };

  const handleReject = async (req) => {
    if (actionLoading) return;
    const trimmed = (adminNotes[req.id] || '').trim();
    if (!trimmed) {
      addToast('Please provide a reason for rejection.', 'error');
      return;
    }
    setActionLoading(req.id);
    try {
      const batch = Firebase.firestore().batch();
      const verificationDocRef = verificationsRef().doc(req.id);
      batch.update(verificationDocRef, {
        status: 'rejected',
        resolvedAt: serverTimestamp(),
        adminNote: trimmed,
        reviewedAt: serverTimestamp(),
        reviewedBy: getReviewedBy(),
      });
      const userDocRef = getUserRef(req.userId);
      batch.update(userDocRef, { verified: false });
      await batch.commit();
      setAdminNotes((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
      setExpandedId(null);
    } catch (err) {
      console.error('Failed to reject verification:', err);
      addToast('Failed to reject. Check console for details.', 'error');
    }
    setActionLoading(null);
  };

  const handleRevoke = async (req) => {
    if (actionLoading) return;
    if (!window.confirm("Revoke this user's verification badge? This will remove the badge from their profile.")) return;
    setActionLoading(req.id);
    try {
      const batch = Firebase.firestore().batch();
      const verificationDocRef = verificationsRef().doc(req.id);
      batch.update(verificationDocRef, {
        status: 'rejected',
        resolvedAt: serverTimestamp(),
        adminNote: 'Verification revoked by admin.',
        reviewedAt: serverTimestamp(),
        reviewedBy: getReviewedBy(),
      });
      const userDocRef = getUserRef(req.userId);
      batch.update(userDocRef, { verified: false });
      await batch.commit();
    } catch (err) {
      console.error('Failed to revoke verification:', err);
      addToast('Failed to revoke. Check console for details.', 'error');
    }
    setActionLoading(null);
  };

  const handleDelete = async (req) => {
    if (actionLoading) return;
    if (!window.confirm('Permanently delete this verification request?')) return;
    setActionLoading(req.id);
    try {
      await verificationsRef().doc(req.id).delete();
    } catch (err) {
      console.error('Failed to delete verification:', err);
      addToast('Failed to delete. Check console for details.', 'error');
    }
    setActionLoading(null);
  };

  const setAdminNote = (docId, value) => {
    setAdminNotes((prev) => ({ ...prev, [docId]: value }));
  };
  const getAdminNote = (docId) => adminNotes[docId] || '';

  return {
    actionLoading,
    expandedId,
    setExpandedId,
    handleApprove,
    handleReject,
    handleRevoke,
    handleDelete,
    getAdminNote,
    setAdminNote,
  };
}
