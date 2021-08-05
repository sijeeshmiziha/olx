import React, { useState, useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import './LinkedAccounts.css';

function LinkedAccounts() {
  const { user: authUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(null);

  if (!authUser) return null;

  const providerIds = (authUser.providerData || []).map((p) => p.providerId);
  const hasGoogle = providerIds.includes('google.com');
  const hasPassword = providerIds.includes('password');
  const canUnlink = providerIds.length > 1;

  const handleLinkGoogle = () => {
    setLinking(true);
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    authUser
      .linkWithPopup(googleProvider)
      .then(() => {
        addToast('Google account linked.', 'success');
      })
      .catch((err) => {
        if (err.code === 'auth/credential-already-in-use') {
          addToast(
            'This Google account is already linked to another user.',
            'error'
          );
        } else {
          addToast(err.message || 'Failed to link Google', 'error');
        }
      })
      .finally(() => setLinking(false));
  };

  const handleUnlink = (providerId) => {
    if (!canUnlink) {
      addToast('You must keep at least one sign-in method.', 'error');
      return;
    }
    setUnlinking(providerId);
    authUser
      .unlink(providerId)
      .then(() => addToast('Account unlinked.', 'success'))
      .catch((err) => addToast(err.message || 'Failed to unlink', 'error'))
      .finally(() => setUnlinking(null));
  };

  return (
    <div className="linkedAccountsSection">
      <h3>Linked accounts</h3>
      <p className="linkedAccountsHint">
        Link multiple sign-in methods to use any of them to log in.
      </p>
      <ul className="linkedAccountsList">
        <li className="linkedAccountItem">
          <span className="linkedAccountName">Google</span>
          {hasGoogle ? (
            <>
              <span className="linkedAccountStatus linked">Linked</span>
              {canUnlink && (
                <button
                  type="button"
                  className="linkedAccountUnlink"
                  disabled={unlinking === 'google.com'}
                  onClick={() => handleUnlink('google.com')}
                >
                  {unlinking === 'google.com' ? 'Unlinking...' : 'Unlink'}
                </button>
              )}
            </>
          ) : (
            <>
              <span className="linkedAccountStatus">Not linked</span>
              <button
                type="button"
                className="linkedAccountLink"
                disabled={linking}
                onClick={handleLinkGoogle}
              >
                {linking ? 'Linking...' : 'Link Google'}
              </button>
            </>
          )}
        </li>
        <li className="linkedAccountItem">
          <span className="linkedAccountName">Email & Password</span>
          {hasPassword ? (
            <span className="linkedAccountStatus linked">Linked</span>
          ) : (
            <span className="linkedAccountStatus">Not linked</span>
          )}
        </li>
      </ul>
    </div>
  );
}

export default LinkedAccounts;
