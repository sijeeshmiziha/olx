/**
 * Firestore FieldValue helpers.
 */
import { firebase } from '../config';

export const serverTimestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = (value) =>
  firebase.firestore.FieldValue.arrayUnion(value);
export const arrayRemove = (value) =>
  firebase.firestore.FieldValue.arrayRemove(value);
export const increment = (n) => firebase.firestore.FieldValue.increment(n);
