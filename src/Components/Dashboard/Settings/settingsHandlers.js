import { Firebase } from '../../../firebase/config';
import {
  usersRef,
  userPreferencesRef,
  productsRef,
  notificationsRef,
  followersRef,
} from '../../../firebase/collections';
import { reauthenticateWithCredential, getEmailCredential, deleteCurrentUser, getGoogleProvider } from '../../../firebase/auth';
import { silentCatch } from '../../../utils/errorHandler';

const BATCH_SIZE = 500;

async function deleteProductsForUser(uid) {
  let snapshot = await productsRef().where('userId', '==', uid).limit(BATCH_SIZE).get();
  while (!snapshot.empty) {
    const batch = Firebase.firestore().batch();
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    if (snapshot.docs.length < BATCH_SIZE) break;
    snapshot = await productsRef().where('userId', '==', uid).limit(BATCH_SIZE).get();
  }
}

async function deleteNotificationsForUser(uid) {
  let snapshot = await notificationsRef().where('userId', '==', uid).limit(BATCH_SIZE).get();
  while (!snapshot.empty) {
    const batch = Firebase.firestore().batch();
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    if (snapshot.docs.length < BATCH_SIZE) break;
    snapshot = await notificationsRef().where('userId', '==', uid).limit(BATCH_SIZE).get();
  }
}

async function deleteFollowersForUser(uid) {
  let snapshot = await followersRef().where('followerId', '==', uid).limit(BATCH_SIZE).get();
  while (!snapshot.empty) {
    const batch = Firebase.firestore().batch();
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    if (snapshot.docs.length < BATCH_SIZE) break;
    snapshot = await followersRef().where('followerId', '==', uid).limit(BATCH_SIZE).get();
  }
  snapshot = await followersRef().where('followingId', '==', uid).limit(BATCH_SIZE).get();
  while (!snapshot.empty) {
    const batch = Firebase.firestore().batch();
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    if (snapshot.docs.length < BATCH_SIZE) break;
    snapshot = await followersRef().where('followingId', '==', uid).limit(BATCH_SIZE).get();
  }
}

async function deleteUserData(uid) {
  await deleteProductsForUser(uid);
  await deleteNotificationsForUser(uid);
  await deleteFollowersForUser(uid);
}

export function handleExportData(user, addToast) {
  if (!user?.uid) return;
  Promise.all([
    usersRef().doc(user.uid).get().then((d) => (d.exists ? d.data() : null)),
    productsRef().where('userId', '==', user.uid).get().then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  ])
    .then(([userData, ads]) => {
      const payload = { exportedAt: new Date().toISOString(), user: userData, ads };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `olx-data-${user.uid}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Data exported.', 'success');
    })
    .catch(() => addToast('Export failed.', 'error'));
}

export function saveNotifPrefs(user, next, setNotifPrefs, setNotifPrefsLoading) {
  if (!user?.uid) return;
  setNotifPrefsLoading(true);
  userPreferencesRef()
    .doc(user.uid)
    .set({ userId: user.uid, notificationSettings: next }, { merge: true })
    .then(() => setNotifPrefs(next))
    .catch(silentCatch('Settings:saveNotifPrefs'))
    .finally(() => setNotifPrefsLoading(false));
}

export function handleChangePassword(e, user, passwordForm, setPasswordForm, setPasswordLoading, setPasswordError, addToast) {
  e.preventDefault();
  setPasswordError('');
  if (passwordForm.new !== passwordForm.confirm) {
    setPasswordError('New passwords do not match');
    return;
  }
  if (passwordForm.new.length < 6) {
    setPasswordError('Password must be at least 6 characters');
    return;
  }
  setPasswordLoading(true);
  const cred = Firebase.auth.EmailAuthProvider.credential(user.email, passwordForm.current);
  user
    .reauthenticateWithCredential(cred)
    .then(() => user.updatePassword(passwordForm.new))
    .then(() => {
      addToast('Password updated successfully', 'success');
      setPasswordForm({ current: '', new: '', confirm: '' });
    })
    .catch((err) => setPasswordError(err.message || 'Failed to update password'))
    .finally(() => setPasswordLoading(false));
}

export function handleDeleteAccount(
  e,
  user,
  setUser,
  isEmailProvider,
  isAnonymous,
  deleteConfirm,
  deletePassword,
  setDeleteLoading,
  addToast,
  history
) {
  e.preventDefault();
  if (deleteConfirm !== 'DELETE') {
    addToast('Type DELETE to confirm', 'error');
    return;
  }
  if (isEmailProvider && !deletePassword) {
    addToast('Enter your password to confirm', 'error');
    return;
  }
  setDeleteLoading(true);
  const doDelete = async () => {
    const uid = user.uid;
    await deleteUserData(uid).catch(silentCatch('Settings:deleteUserData'));
    await usersRef()
      .doc(uid)
      .delete()
      .catch(silentCatch('Settings:deleteUserDoc'));
    await deleteCurrentUser();
  };
  let promise;
  if (isAnonymous) {
    promise = doDelete();
  } else if (isEmailProvider) {
    promise = reauthenticateWithCredential(getEmailCredential(user.email, deletePassword)).then(doDelete);
  } else {
    promise = user
      .reauthenticateWithPopup(getGoogleProvider())
      .then(doDelete)
      .catch((err) => {
        addToast(err.message || 'Re-authentication failed. Try again.', 'error');
        setDeleteLoading(false);
      });
  }
  promise
    .then(() => {
      setUser(null);
      addToast('Account deleted', 'success');
      history.replace('/');
    })
    .catch((err) => {
      addToast(err.message || 'Could not delete account', 'error');
      setDeleteLoading(false);
    });
}
