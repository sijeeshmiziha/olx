import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SellerRating from '../Reviews/SellerRating';
import { AuthContext } from '../../contextStore/AuthContext';
import { useFollow } from '../../hooks/useFollow';
import VerifiedBadge from '../UI/VerifiedBadge';
import './ProfileHeader.css';

const BADGE_LABELS = { new: 'New', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };

function safeHref(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

function ProfileHeader({
  userData,
  isOwnProfile,
  totalAds = 0,
  activeAds = 0,
  ratingSum,
  ratingCount,
}) {
  const { user } = useContext(AuthContext);
  const userId = userData?.id;
  const { following, loading: followLoading, toggle: handleFollow } = useFollow(user?.uid, userId);

  const memberSince = userData?.memberSince
    ? new Date(
        userData.memberSince.seconds
          ? userData.memberSince.seconds * 1000
          : userData.memberSince
      ).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Member';

  const isVerified = userData?.verified === true;
  const trustScore = userData?.trustScore ?? 0;
  const badgeLevel = userData?.badgeLevel || 'new';
  const socialLinks = userData?.socialLinks || {};
  const hasSocial = Object.values(socialLinks).some(Boolean);
  const businessInfo = userData?.businessInfo || {};

  return (
    <div className="profileHeader">
      {userData?.coverPhoto && (
        <div className="profileCover" style={{ backgroundImage: `url(${userData.coverPhoto})` }} />
      )}
      <div className="profileAvatar">
        {userData?.avatar ? (
          <img src={userData.avatar} alt="" />
        ) : (
          <span className="avatarPlaceholder">
            {(userData?.name || 'U').charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="profileInfo">
        <h1 className="profileName">
          {userData?.name || 'User'}
          {isVerified && <VerifiedBadge size={20} className="profileVerifiedIcon" title="Verified seller" />}
          {userData?.emailVerified && <span className="profileBadgeSmall" title="Email verified">📧</span>}
          {userData?.phoneVerified && <span className="profileBadgeSmall" title="Phone verified">📱</span>}
          {userData?.idVerified && <span className="profileBadgeSmall" title="ID verified">🪪</span>}
        </h1>
        {isVerified && (
          <span className="profileVerifiedLabel">Verified seller</span>
        )}
        {badgeLevel !== 'new' && (
          <span className="profileBadgeLevel">{BADGE_LABELS[badgeLevel] || badgeLevel}</span>
        )}
        {trustScore > 0 && (
          <div className="profileTrustScore">
            <span>Trust score </span>
            <div className="profileTrustBar"><div className="profileTrustFill" style={{ width: `${trustScore}%` }} /></div>
            <span>{trustScore}%</span>
          </div>
        )}
        {(userData?.responseRate != null || userData?.responseTime) && (
          <p className="profileResponse">
            {userData.responseRate != null && `${userData.responseRate}% response rate`}
            {userData.responseTime && ` · ${userData.responseTime}`}
          </p>
        )}
        {userData?.about && (
          <p className="profileAbout">{userData.about}</p>
        )}
        {userData?.location?.city && (
          <p className="profileLocation">
            {userData.location.city}
            {userData.location.state && `, ${userData.location.state}`}
          </p>
        )}
        {(userData?.companyName || businessInfo.companyName) && (
          <p className="profileCompany">{userData.companyName || businessInfo.companyName}</p>
        )}
        {hasSocial && (
          <div className="profileSocialLinks">
            {safeHref(socialLinks.facebook) && <a href={safeHref(socialLinks.facebook)} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {safeHref(socialLinks.instagram) && <a href={safeHref(socialLinks.instagram)} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {safeHref(socialLinks.twitter) && <a href={safeHref(socialLinks.twitter)} target="_blank" rel="noopener noreferrer">Twitter</a>}
          </div>
        )}
        {userData?.languages && (
          <p className="profileLanguages">
            Speaks: {userData.languages}
          </p>
        )}
        <p className="profileMemberSince">Member since {memberSince}</p>
        {(ratingSum != null || ratingCount) && (
          <p className="profileRating">
            <SellerRating ratingSum={ratingSum} ratingCount={ratingCount} />
          </p>
        )}
        <div className="profileStats">
          <span>{totalAds} total ads</span>
          <span>{activeAds} active</span>
          {userData?.followersCount != null && (
            <Link to={`/profile/${userId}/followers`} className="profileStatLink">
              {Math.max(0, userData.followersCount)} followers
            </Link>
          )}
          {userData?.followingCount != null && (
            <Link to={`/profile/${userId}/following`} className="profileStatLink">
              {Math.max(0, userData.followingCount)} following
            </Link>
          )}
        </div>
        {!isOwnProfile && user && userId && user.uid !== userId && (
          <button
            type="button"
            className="profileFollowBtn"
            onClick={handleFollow}
            disabled={followLoading}
          >
            {following ? 'Unfollow' : 'Follow'}
          </button>
        )}
        {isOwnProfile && (
          <Link to="/profile/edit" className="profileEditBtn">
            Edit profile
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
