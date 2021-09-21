/**
 * Follower collection helpers.
 */
import { db, followersRef } from './refs';
import { getUserRef } from './userHelpers';
import { serverTimestamp } from './fieldValues';

export const getFollowersForUser = (userId, limit = 100) =>
  followersRef()
    .where('followingId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit);
export const getFollowingForUser = (userId, limit = 100) =>
  followersRef()
    .where('followerId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit);
export const getFollowDocRef = (followerId, followingId) =>
  followersRef()
    .where('followerId', '==', followerId)
    .where('followingId', '==', followingId)
    .limit(1);

export async function toggleFollow(followerId, followingId) {
  if (followerId === followingId) return { action: 'none' };
  const snapshot = await getFollowDocRef(followerId, followingId).get();
  const userRef = getUserRef(followingId);
  const followerUserRef = getUserRef(followerId);

  const followDocId = followerId + '__' + followingId;
  const followDocRef = followersRef().doc(followDocId);

  if (snapshot.empty) {
    await db.runTransaction(async (tx) => {
      // All reads must come before any writes in a Firestore transaction
      const targetSnap = await tx.get(userRef);
      const followerSnap = await tx.get(followerUserRef);
      const curFollowers = targetSnap.exists
        ? Math.max(0, targetSnap.data().followersCount || 0)
        : 0;
      const curFollowing = followerSnap.exists
        ? Math.max(0, followerSnap.data().followingCount || 0)
        : 0;
      // Now perform all writes
      tx.set(followDocRef, {
        followerId,
        followingId,
        createdAt: serverTimestamp(),
      });
      tx.update(userRef, {
        followersCount: curFollowers + 1,
        updatedAt: serverTimestamp(),
      });
      tx.update(followerUserRef, {
        followingCount: curFollowing + 1,
        updatedAt: serverTimestamp(),
      });
    });
    return { action: 'followed' };
  }

  const docRef = snapshot.docs[0].ref;
  await db.runTransaction(async (tx) => {
    const targetSnap = await tx.get(userRef);
    const followerSnap = await tx.get(followerUserRef);
    const curFollowers = targetSnap.exists
      ? Math.max(0, targetSnap.data().followersCount || 0)
      : 0;
    const curFollowing = followerSnap.exists
      ? Math.max(0, followerSnap.data().followingCount || 0)
      : 0;
    tx.delete(docRef);
    tx.update(userRef, {
      followersCount: Math.max(0, curFollowers - 1),
      updatedAt: serverTimestamp(),
    });
    tx.update(followerUserRef, {
      followingCount: Math.max(0, curFollowing - 1),
      updatedAt: serverTimestamp(),
    });
  });
  return { action: 'unfollowed' };
}

export async function isFollowing(followerId, followingId) {
  if (followerId === followingId) return false;
  const snapshot = await getFollowDocRef(followerId, followingId).get();
  return !snapshot.empty;
}
