import { useState, useEffect, useCallback } from 'react';
import { toggleFollow, isFollowing } from '../firebase/collections';
import { canProceed, RATE_LIMITS } from '../utils/rateLimit';

/**
 * Shared follow/unfollow state and toggle for a target user.
 * Used in SellerCard and ProfileHeader.
 * @param {string} currentUserId - Logged-in user id
 * @param {string} targetUserId - User to follow/unfollow
 * @returns {{ following: boolean, loading: boolean, toggle: () => Promise<void> }}
 */
export function useFollow(currentUserId, targetUserId) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;
    isFollowing(currentUserId, targetUserId).then(setFollowing);
  }, [currentUserId, targetUserId]);

  const toggle = useCallback(async () => {
    if (!currentUserId || !targetUserId || loading) return;
    if (!canProceed(`follow:${currentUserId}`, RATE_LIMITS.FOLLOW_TOGGLE_MS)) return;
    setLoading(true);
    try {
      const { action } = await toggleFollow(currentUserId, targetUserId);
      setFollowing(action === 'followed');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, targetUserId, loading]);

  return { following, loading, toggle };
}
