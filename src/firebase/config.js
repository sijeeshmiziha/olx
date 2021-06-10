import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Read from .env (copy .env.example to .env). No hardcoded fallbacks; fail fast if config is missing.
const envKeys = {
  apiKey: 'REACT_APP_FIREBASE_API_KEY',
  authDomain: 'REACT_APP_FIREBASE_AUTH_DOMAIN',
  projectId: 'REACT_APP_FIREBASE_PROJECT_ID',
  storageBucket: 'REACT_APP_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REACT_APP_FIREBASE_APP_ID',
  measurementId: 'REACT_APP_FIREBASE_MEASUREMENT_ID',
};

const requiredEnvKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const firebaseConfig = {};
for (const key of Object.keys(envKeys)) {
  const value = process.env[envKeys[key]];
  if (requiredEnvKeys.includes(key) && !value) {
    throw new Error(
      `Missing Firebase config: ${envKeys[key]}. Set REACT_APP_FIREBASE_* in .env (see .env.example).`
    );
  }
  firebaseConfig[key] = value || '';
}

export const Firebase = firebase.initializeApp(firebaseConfig);
export { firebase };

// Firestore offline persistence: cache data for offline browsing and sync when back online
try {
  firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('Firestore persistence failed:', err.message);
    }
  });
} catch (_) {}

// Firestore: create composite indexes in Firebase Console as needed for:
// products (category, createdAt), (status, createdAt), (location.state, location.city, createdAt)
// conversations (participants array-contains, lastMessageAt)
