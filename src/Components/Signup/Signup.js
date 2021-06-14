import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Signup.css';
import { getGoogleProvider } from '../../firebase/auth';
import OverlaySpinner from '../Loading/OverlaySpinner';
import { ToastContext } from '../../contextStore/ToastContext';
import { handleSocialSignUp, handleGuestContinue, handleSubmit as onSubmit } from './signupHandlers';

const Logo = `${process.env.PUBLIC_URL || ''}/assets/images/olx-logo.png`;

export default function Signup() {
  const history = useHistory();
  const { addToast } = useContext(ToastContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) =>
    onSubmit(e, {
      name,
      email,
      phone,
      password,
      termsAccepted,
      setLoading,
      setErrors,
      addToast,
      history,
    });

  const onSocialSignUp = () =>
    handleSocialSignUp('google', getGoogleProvider(), {
      setLoading,
      setErrors,
      addToast,
      history,
    });

  const onGuestContinue = () => handleGuestContinue({ addToast, history });

  return (
    <>
      {loading && <OverlaySpinner />}
      <div className="signupPageWrapper">
        <Link to="/" className="signupHomeLink">
          ← Back to Home
        </Link>
        <div className="signupParentDiv">
          <Link to="/" className="signupLogoLink">
            <img width="80" height="80" src={Logo} alt="OLX" />
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="signupFormGroup">
              <label>Full Name</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                placeholder="Enter your full name"
              />
              {errors.name && <span className="formError">{errors.name}</span>}
            </div>
            <div className="signupFormGroup">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                placeholder="sijeesh@gmail.com"
              />
              {errors.email && (
                <span className="formError">{errors.email}</span>
              )}
            </div>
            <div className="signupFormGroup">
              <label>Phone</label>
              <input
                className="input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                name="phone"
                placeholder="10-digit mobile number"
              />
              {errors.phone && (
                <span className="formError">{errors.phone}</span>
              )}
            </div>
            <div className="signupFormGroup">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="Min 8 characters (uppercase, lowercase, number)"
              />
              {errors.password && (
                <span className="formError">{errors.password}</span>
              )}
            </div>
            <div className="signupFormGroup">
              <label className="signupTermsLabel">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                I accept the <Link to="/legal">Terms and Conditions</Link> and{' '}
                <Link to="/legal">Privacy Policy</Link>
              </label>
              {errors.terms && (
                <span className="formError">{errors.terms}</span>
              )}
              {errors.form && <span className="formError">{errors.form}</span>}
            </div>
            <button type="submit">Signup</button>
          </form>
          <div className="signupDivider">or</div>
          <button
            type="button"
            className="signupGoogleBtn"
            onClick={onSocialSignUp}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="signupGuestBtn"
            onClick={onGuestContinue}
          >
            Continue as Guest
          </button>
          <Link to="/login" className="signupLoginLink">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
