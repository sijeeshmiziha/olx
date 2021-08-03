import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import PostCards from '../PostCards/PostCards';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserRef, getProductsQuery } from '../../firebase/collections';
import { migrateUserDoc } from '../../firebase/migration';
import { ProfileSkeleton, CardSkeleton } from '../UI/Skeleton';
import SellerRating from '../Reviews/SellerRating';
import ReviewList from '../Reviews/ReviewList';
import ReviewModal from '../Reviews/ReviewModal';
import './Profile.css';

const ADS_PER_PAGE = 8;

function Profile() {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [totalAds, setTotalAds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Published ads state
  const [userAds, setUserAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ADS_PER_PAGE);

  const isOwnProfile = Boolean(user && userId === user.uid);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('No user specified');
      return;
    }
    const unsub = getUserRef(userId).onSnapshot(
      (doc) => {
        if (doc.exists) setUserData(migrateUserDoc(doc));
        else setError('User not found');
        setLoading(false);
      },
      () => {
        setError('Failed to load profile');
        setLoading(false);
      }
    );
    return () => unsub && unsub();
  }, [userId]);

  // Fetch user's published ads
  useEffect(() => {
    if (!userId) return;
    setAdsLoading(true);
    setVisibleCount(ADS_PER_PAGE);
    const query = getProductsQuery({ userId, status: 'active' });
    query
      .get()
      .then((snapshot) => {
        const ads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserAds(ads);
        setTotalAds(ads.length);
        setAdsLoading(false);
      })
      .catch(() => {
        setUserAds([]);
        setTotalAds(0);
        setAdsLoading(false);
      });
  }, [userId]);

  const visibleAds = useMemo(
    () => userAds.slice(0, visibleCount),
    [userAds, visibleCount]
  );
  const hasMoreAds = visibleCount < userAds.length;

  const handleLoadMore = () => {
    setVisibleCount((c) => Math.min(c + ADS_PER_PAGE, userAds.length));
  };

  if (loading) return <ProfileSkeleton />;
  if (error || !userData) {
    return (
      <div className="profilePage">
        <p>{error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div className="profilePage">
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        totalAds={totalAds}
        activeAds={totalAds}
        ratingSum={userData.ratingSum}
        ratingCount={userData.ratingCount}
      />

      {/* Published Ads Section */}
      <div className="profileSection profileAdsSection">
        <div className="profileAdsHeader">
          <h3>Published Ads</h3>
          <span className="profileAdsCount">{totalAds} {totalAds === 1 ? 'ad' : 'ads'}</span>
        </div>
        {adsLoading && (
          <div className="profileAdsGrid">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {!adsLoading && userAds.length === 0 && (
          <div className="profileAdsEmpty">
            <span className="profileAdsEmptyIcon">📦</span>
            <p>No ads published yet</p>
          </div>
        )}
        {!adsLoading && userAds.length > 0 && (
          <>
            <div className="profileAdsGrid">
              {visibleAds.map((product, index) => (
                <div className="profileAdCard" key={product.id || index}>
                  <PostCards product={product} index={index} />
                </div>
              ))}
            </div>
            {hasMoreAds && (
              <div className="profileAdsLoadMore">
                <button
                  type="button"
                  className="profileLoadMoreBtn"
                  onClick={handleLoadMore}
                >
                  Load more ads
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {!isOwnProfile && user && (
        <div className="profileSection">
          <button
            type="button"
            className="profileLeaveReviewBtn"
            onClick={() => setShowReviewModal(true)}
          >
            Leave a review
          </button>
        </div>
      )}
      <div className="profileSection">
        <h3>Reviews</h3>
        {(userData.ratingSum != null || userData.ratingCount) && (
          <p>
            <SellerRating
              ratingSum={userData.ratingSum}
              ratingCount={userData.ratingCount}
            />
          </p>
        )}
        <ReviewList sellerId={userId} />
      </div>
      {showReviewModal && (
        <ReviewModal
          sellerId={userId}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}

export default Profile;
