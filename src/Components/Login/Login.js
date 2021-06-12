import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { ensureUserDoc } from '../../firebase/collections';
import {
  signInWithPopup,
  getGoogleProvider,
} from '../../firebase/auth';
import { logLogin } from '../../firebase/analytics';
import { ToastContext } from '../../contextStore/ToastContext';
import OverlaySpinner from '../Loading/OverlaySpinner';
import { validateEmail, validatePassword } from '../../utils/validation';
import './Login.css';

const Logo = `${process.env.PUBLIC_URL || ''}/assets/images/olx-logo.png`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { addToast } = useContext(ToastContext);

  const from = history.location.state?.from?.pathname || '/';

  const handleSocialLogin = (providerName, provider) => {
    setLoading(true);
    setErrors({});
    signInWithPopup(provider)
      .then((result) => ensureUserDoc(result.user))
      .then(() => {
        logLogin(providerName);
        addToast('Welcome back!', 'success');
        history.replace(from);
      })
      .catch((error) => {
        setLoading(false);
        setErrors({ form: 'Something went wrong. Please try again.' });
      });
  };

  const handleGuestContinue = () => {
    addToast('Browsing as guest. Sign in to post ads or chat.', 'info');
    history.replace('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    const eErr = validateEmail(email);
    if (eErr) err.email = eErr;
    const pErr = validatePassword(password, { requireStrength: false, minLength: 1 });
    if (pErr) err.password = pErr;
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        logLogin('email');
        addToast('Welcome back!', 'success');
        history.replace(from);
      })
      .catch((error) => {
        setLoading(false);
        setErrors({ form: 'Something went wrong. Please try again.' });
      });
  };

  return (
    <>
      {loading && <OverlaySpinner />}
      <div className="loginPageWrapper">
        <Link to="/" className="loginHomeLink">
          ← Back to Home
        </Link>
        <div className="loginParentDiv">
          <Link to="/" className="loginLogoLink">
            <img width="80" height="80" src={Logo} alt="OLX" />
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="loginFormGroup">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="sijeesh@gmail.com"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="formError">{errors.email}</span>
              )}
            </div>
            <div className="loginFormGroup">
              <label>Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="formError">{errors.password}</span>
              )}
              {errors.form && <span className="formError">{errors.form}</span>}
            </div>
            <Link to="/forgot-password" className="loginForgotLink">
              Forgot password?
            </Link>
            <button type="submit">Login</button>
          </form>
          <div className="loginDivider">or</div>
          <button
            type="button"
            className="loginGoogleBtn"
            onClick={() => handleSocialLogin('google', getGoogleProvider())}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="loginGuestBtn"
            onClick={handleGuestContinue}
          >
            Continue as Guest
          </button>
          <Link to="/signup" className="loginSignupLink">
            Signup
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
