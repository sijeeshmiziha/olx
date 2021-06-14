/**
 * Firebase Auth helpers: email verification, phone OTP, social providers,
 * anonymous auth, account deletion, email link sign-in.
 */

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Firebase } from './config';

const auth = Firebase.auth();

// ─── Email verification ───────────────────────────────────────────────────
export function sendEmailVerification() {
  const user = auth.currentUser;
  if (!user || user.emailVerified) return Promise.resolve();
  return user.sendEmailVerification({
    url: window.location.origin + '/login',
    handleCodeInApp: false,
  });
}

export function isEmailVerified() {
  return auth.currentUser?.emailVerified ?? false;
}

// ─── Phone / OTP (Spark plan: 10 SMS/day) ──────────────────────────────────
export function signInWithPhoneNumber(phoneNumber, appVerifier) {
  return auth.signInWithPhoneNumber(phoneNumber, appVerifier);
}

export function linkPhoneNumber(phoneNumber, appVerifier) {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error('Not signed in'));
  return user.linkWithPhoneNumber(phoneNumber, appVerifier);
}

// ─── Social providers ──────────────────────────────────────────────────────
export function getGoogleProvider() {
  return new firebase.auth.GoogleAuthProvider();
}


export function signInWithPopup(provider) {
  return auth.signInWithPopup(provider);
}

export function linkWithPopup(provider) {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error('Not signed in'));
  return user.linkWithPopup(provider);
}

// ─── Anonymous (guest) ─────────────────────────────────────────────────────
export function signInAnonymously() {
  return auth.signInAnonymously();
}

export function isAnonymous() {
  return auth.currentUser?.isAnonymous ?? false;
}

export function linkAnonymousWithCredential(credential) {
  const user = auth.currentUser;
  if (!user || !user.isAnonymous) return Promise.reject(new Error('Not an anonymous user'));
  return user.linkWithCredential(credential);
}

// ─── Email link (passwordless) ─────────────────────────────────────────────
export function sendSignInLinkToEmail(email, actionCodeSettings) {
  const settings = actionCodeSettings || {
    url: window.location.origin + '/login',
    handleCodeInApp: true,
  };
  return auth.sendSignInLinkToEmail(email, settings);
}

export function isSignInWithEmailLink(href) {
  return auth.isSignInWithEmailLink(href || window.location.href);
}

export function signInWithEmailLink(email, link) {
  return auth.signInWithEmailLink(email, link || window.location.href);
}

// ─── Account deletion ──────────────────────────────────────────────────────
export function deleteCurrentUser() {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error('Not signed in'));
  return user.delete();
}

export function reauthenticateWithCredential(credential) {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error('Not signed in'));
  return user.reauthenticateWithCredential(credential);
}

export function getEmailCredential(email, password) {
  return firebase.auth.EmailAuthProvider.credential(email, password);
}

// ─── Current user ─────────────────────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

export function signOut() {
  return auth.signOut();
}
