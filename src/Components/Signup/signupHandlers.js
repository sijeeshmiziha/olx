import { Firebase } from '../../firebase/config';
import { ensureUserDoc } from '../../firebase/collections';
import {
  sendEmailVerification,
  signInWithPopup,
} from '../../firebase/auth';
import { logSignUp } from '../../firebase/analytics';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../../utils/validation';

export function handleSocialSignUp(providerName, provider, { setLoading, setErrors, addToast, history }) {
  setLoading(true);
  setErrors({});
  signInWithPopup(provider)
    .then((result) => ensureUserDoc(result.user))
    .then(() => {
      logSignUp(providerName);
      addToast('Account created. Welcome!', 'success');
      history.push('/');
    })
    .catch((error) => {
      setLoading(false);
      setErrors({
        form: 'Something went wrong. Please try again.',
      });
    });
}

export function handleGuestContinue({ addToast, history }) {
  addToast('Browsing as guest. Sign up to post ads or chat.', 'info');
  history.push('/');
}

export function handleSubmit(e, { name, email, phone, password, termsAccepted, setLoading, setErrors, addToast, history }) {
  e.preventDefault();
  const err = {};
  if (validateRequired(name, 'Full name'))
    err.name = 'Full name is required.';
  const eErr = validateEmail(email);
  if (eErr) err.email = eErr;
  const pErr = validatePhone(phone);
  if (pErr) err.phone = pErr;
  const pwErr = validatePassword(password);
  if (pwErr) err.password = pwErr;
  if (!termsAccepted) err.terms = 'You must accept the Terms and Conditions.';
  setErrors(err);
  if (Object.keys(err).length > 0) return;

  setLoading(true);
  Firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      return result.user.updateProfile({ displayName: name }).then(() =>
        ensureUserDoc(result.user, {
          name: name.trim(),
          phone: String(phone).trim(),
        })
      );
    })
    .then(() => sendEmailVerification())
    .then(() => {
      logSignUp('email');
      addToast('Account created. Check your email to verify, then log in.', 'success');
      history.push('/login');
    })
    .catch((error) => {
      setLoading(false);
      setErrors({ form: 'Something went wrong. Please try again.' });
    });
}
