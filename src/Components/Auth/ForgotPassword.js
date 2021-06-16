import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { ToastContext } from '../../contextStore/ToastContext';
import { validateEmail } from '../../utils/validation';
import ButtonSpinner from '../UI/ButtonSpinner';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useContext(ToastContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    Firebase.auth()
      .sendPasswordResetEmail(email.trim())
      .then(() => {
        setSent(true);
        addToast('Password reset email sent. Check your inbox.', 'success');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'Failed to send reset email');
      });
  };

  if (sent) {
    return (
      <div className="forgotPasswordWrap">
        <div className="forgotPasswordCard">
          <h2>Check your email</h2>
          <p>
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="forgotPasswordWrap">
      <div className="forgotPasswordCard">
        <h2>Forgot password?</h2>
        <p>
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="forgotFormGroup">
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error && <span className="formError">{error}</span>}
          </div>
          <button type="submit" disabled={loading}>
            {loading && <ButtonSpinner />}Send reset link
          </button>
        </form>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
