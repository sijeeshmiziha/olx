import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contextStore/AuthContext';
import { blockedUsersRef, serverTimestamp } from '../../firebase/collections';
import { ToastContext } from '../../contextStore/ToastContext';
import './BlockButton.css';

function BlockButton({ userId, userName, onBlocked, className }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  if (!user || !userId || user.uid === userId) return null;

  const handleBlock = () => {
    if (!window.confirm(`Block ${userName || 'this user'}? They won't be able to message you.`)) return;
    setLoading(true);
    blockedUsersRef()
      .add({
        blockerId: user.uid,
        blockedId: userId,
        createdAt: serverTimestamp(),
      })
      .then(() => {
        addToast('User blocked.', 'success');
        if (onBlocked) onBlocked();
      })
      .catch(() => {
        addToast('Failed to block user.', 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <button
      type="button"
      className={className ? `blockUserBtn ${className}` : 'blockUserBtn'}
      onClick={handleBlock}
      disabled={loading}
    >
      {loading ? '...' : 'Block user'}
    </button>
  );
}

export default BlockButton;
