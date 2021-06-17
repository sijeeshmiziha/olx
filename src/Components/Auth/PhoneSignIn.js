import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { signInWithPhoneNumber } from '../../firebase/auth';
import { ensureUserDoc } from '../../firebase/collections';
import { logLogin } from '../../firebase/analytics';
import { ToastContext } from '../../contextStore/ToastContext';

const RECAPTCHA_CONTAINER_ID = 'recaptcha-phone-container';

export default function PhoneSignIn() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);
  const history = useHistory();
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) recaptchaRef.current.clear?.();
    };
  }, []);

  const getAppVerifier = () => {
    if (recaptchaRef.current) return recaptchaRef.current;
    const container = document.getElementById(RECAPTCHA_CONTAINER_ID);
    if (!container) throw new Error('Recaptcha container not found');
    recaptchaRef.current = new Firebase.auth.RecaptchaVerifier(container, {
      size: 'invisible',
      callback: () => {},
    });
    return recaptchaRef.current;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const raw = phone.trim().replace(/\D/g, '');
    const number = raw.length === 10 ? '+91' + raw : raw.startsWith('+') ? phone.trim() : '+' + raw;
    if (number.length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    getAppVerifier()
      .verify()
      .then(() => signInWithPhoneNumber(number, getAppVerifier()))
      .then((confirmation) => {
        confirmationRef.current = confirmation;
        setStep('otp');
        addToast('OTP sent to your phone', 'success');
      })
      .catch((err) => {
        setError(err.message || 'Failed to send OTP');
        if (recaptchaRef.current) recaptchaRef.current.clear?.();
      })
      .finally(() => setLoading(false));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Enter the OTP');
      return;
    }
    if (!confirmationRef.current) {
      setError('Session expired. Request OTP again.');
      return;
    }
    setError('');
    setLoading(true);
    confirmationRef.current
      .confirm(otp.trim())
      .then((result) => ensureUserDoc(result.user, { phone: phone.trim() }))
      .then(() => {
        logLogin('phone');
        addToast('Signed in successfully', 'success');
        history.replace('/');
      })
      .catch((err) => {
        setError(err.message || 'Invalid OTP');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="loginPageWrapper">
      <Link to="/login" className="loginHomeLink">
        ← Back to Login
      </Link>
      <div className="loginParentDiv">
        <h2 style={{ marginBottom: 16, fontSize: 20 }}>Sign in with Phone</h2>
        <p style={{ fontSize: 13, color: 'var(--olx-text-muted)', marginBottom: 16 }}>
          You will receive an SMS with a one-time code. (Limited SMS on free plan.)
        </p>
        <div id={RECAPTCHA_CONTAINER_ID} />
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <div className="loginFormGroup">
              <label>Phone number</label>
              <input
                className="input"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <span className="formError">{error}</span>}
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="loginFormGroup">
              <label>Enter OTP</label>
              <input
                className="input"
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
              />
            </div>
            {error && <span className="formError">{error}</span>}
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & sign in'}
            </button>
            <button
              type="button"
              className="loginGuestBtn"
              style={{ marginTop: 8 }}
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Change number
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
