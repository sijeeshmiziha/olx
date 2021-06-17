import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../../firebase/auth';
import { ensureUserDoc } from '../../firebase/collections';
import { logLogin } from '../../firebase/analytics';
import { ToastContext } from '../../contextStore/ToastContext';

const EMAIL_LINK_KEY = 'olx_email_for_signin';

export function getEmailLinkStorageKey() {
  return EMAIL_LINK_KEY;
}

export default function EmailLinkSignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(true);
  const history = useHistory();
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    if (!isSignInWithEmailLink(window.location.href)) {
      setCompleting(false);
      const saved = window.localStorage.getItem(EMAIL_LINK_KEY);
      if (saved) setEmail(saved);
      return;
    }
    const savedEmail = window.localStorage.getItem(EMAIL_LINK_KEY);
    if (!savedEmail) {
      setCompleting(false);
      setError('Invalid or expired link. Request a new sign-in link.');
      return;
    }
    setLoading(true);
    signInWithEmailLink(savedEmail, window.location.href)
      .then((result) => ensureUserDoc(result.user))
      .then(() => {
        window.localStorage.removeItem(EMAIL_LINK_KEY);
        logLogin('email_link');
        addToast('Signed in successfully.', 'success');
        history.replace('/');
      })
      .catch((err) => {
        setError(err.message || 'Sign-in failed');
        setCompleting(false);
      })
      .finally(() => setLoading(false));
  }, [history, addToast]);

  const handleSendLink = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter your email.');
      return;
    }
    setError('');
    setLoading(true);
    sendSignInLinkToEmail(email.trim(), {
      url: window.location.origin + '/login/email-link',
      handleCodeInApp: true,
    })
      .then(() => {
        window.localStorage.setItem(EMAIL_LINK_KEY, email.trim());
        setSent(true);
        addToast('Check your email for the sign-in link.', 'success');
      })
      .catch((err) => {
        setError(err.message || 'Failed to send link');
      })
      .finally(() => setLoading(false));
  };

  if (completing || loading) {
    return (
      <div className="loginPageWrapper" style={{ justifyContent: 'center' }}>
        <p>Signing you in...</p>
      </div>
    );
  }

  return (
    <div className="loginPageWrapper">
      <Link to="/login" className="loginHomeLink">
        ← Back to Login
      </Link>
      <div className="loginParentDiv">
        <h2 style={{ marginBottom: 16, fontSize: 20 }}>Sign in with email link</h2>
        {sent ? (
          <p style={{ color: 'var(--olx-text)', marginBottom: 16 }}>
            We sent a sign-in link to <strong>{email}</strong>. Click the link in that email to sign in.
          </p>
        ) : (
          <form onSubmit={handleSendLink}>
            <div className="loginFormGroup">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <span className="formError">{error}</span>}
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send sign-in link'}
            </button>
          </form>
        )}
        <Link to="/login" className="loginSignupLink" style={{ marginTop: 16, display: 'block' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
