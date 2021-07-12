import { useState, useEffect } from 'react';
import { getProductRef, getUserRef, increment, isPremiumUser } from '../../../firebase/collections';
import { silentCatch } from '../../../utils/errorHandler';

export function useViewData(postContent, history, viewerUid) {
  const [userDetails, setUserDetails] = useState();
  const [viewerIsPremium, setViewerIsPremium] = useState(false);

  useEffect(() => {
    const userId = postContent?.userId;
    if (userId === undefined) {
      history.push('/');
    } else if (userId) {
      setUserDetails(undefined);
      getUserRef(userId)
        .get()
        .then((doc) => {
          if (doc.exists) setUserDetails({ id: doc.id, ...doc.data() });
        })
        .catch(silentCatch('View:loadUser'));
    }
  }, [history, postContent?.userId]);

  useEffect(() => {
    if (!viewerUid) {
      setViewerIsPremium(false);
      return;
    }
    getUserRef(viewerUid)
      .get()
      .then((doc) => {
        setViewerIsPremium(doc.exists ? isPremiumUser(doc.data()) : false);
      })
      .catch(silentCatch('View:loadViewerPremium'));
  }, [viewerUid]);

  useEffect(() => {
    if (postContent?.id) {
      getProductRef(postContent.id)
        .update({ 'stats.views': increment(1) })
        .catch(silentCatch('View:incrementViewCount'));
    }
  }, [postContent?.id]);

  return { userDetails, setUserDetails, viewerIsPremium };
}
