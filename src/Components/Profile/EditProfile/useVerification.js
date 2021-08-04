import { useState, useRef } from 'react';
import { Firebase } from '../../../firebase/config';
import { verificationsRef, serverTimestamp } from '../../../firebase/collections';
import { COOLDOWN_DAYS } from '../../../constants';
import { silentCatch } from '../../../utils/errorHandler';

const MAX_ID_SIZE = 5 * 1024 * 1024;

export function useVerification(user, userName, verificationDoc, vStatus, isResolved, cooldownActive, daysRemaining, addToast) {
  const verificationFileRef = useRef(null);
  const [verificationReason, setVerificationReason] = useState('');
  const [verificationIdFile, setVerificationIdFile] = useState(null);
  const [verificationIdPreview, setVerificationIdPreview] = useState(null);
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const handleVerificationIdSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image of your ID document.', 'error');
      return;
    }
    if (file.size > MAX_ID_SIZE) {
      addToast('ID image must be less than 5 MB.', 'error');
      return;
    }
    setVerificationIdFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setVerificationIdPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || submittingVerification) return;
    if (!verificationReason.trim()) {
      addToast('Please provide a reason for verification.', 'error');
      return;
    }
    if (!verificationIdFile) {
      addToast('ID document is required to apply for verification.', 'error');
      return;
    }
    if (vStatus === 'pending') {
      addToast('You already have a pending verification request.', 'error');
      return;
    }
    if (isResolved && cooldownActive) {
      addToast(
        `You can only submit one request every ${COOLDOWN_DAYS} days. ${daysRemaining} day(s) remaining.`,
        'error'
      );
      return;
    }
    setSubmittingVerification(true);
    try {
      const ext = verificationIdFile.name.split('.').pop();
      const storageRef = Firebase.storage().ref(`profiles/${user.uid}/verification-id.${ext}`);
      await storageRef.put(verificationIdFile);
      const idDocUrl = await storageRef.getDownloadURL();
      await verificationsRef().add({
        userId: user.uid,
        userName: (userName || '').trim() || user.displayName || '',
        userEmail: user.email || '',
        reason: verificationReason.trim(),
        idDocumentUrl: idDocUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      if (verificationDoc) {
        verificationsRef()
          .doc(verificationDoc.id)
          .delete()
          .catch(silentCatch('EditProfile:deleteOldVerification'));
      }
      setVerificationReason('');
      setVerificationIdFile(null);
      setVerificationIdPreview(null);
      if (verificationFileRef.current) verificationFileRef.current.value = '';
      addToast('Verification request submitted! We will review it shortly.', 'success');
    } catch (err) {
      console.error('Verification request failed:', err);
      addToast('Failed to submit verification request.', 'error');
    }
    setSubmittingVerification(false);
  };

  return {
    verificationReason,
    setVerificationReason,
    verificationIdFile,
    setVerificationIdFile,
    verificationIdPreview,
    setVerificationIdPreview,
    submittingVerification,
    verificationFileRef,
    handleVerificationIdSelect,
    handleVerificationSubmit,
  };
}
