import React from 'react';
import SellerRating from '../../Reviews/SellerRating';
import VerifiedBadge from '../../UI/VerifiedBadge';

const BADGE_LABELS = { new: 'New', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };

export default function SellerInfo({
  userDetails,
  userId,
  currentUserId,
  following,
  followLoading,
  onFollow,
}) {
  if (!userDetails) return null;

  const trustScore = userDetails.trustScore ?? 0;
  const badgeLevel = userDetails.badgeLevel || 'new';
  const socialLinks = userDetails.socialLinks || {};
  const businessInfo = userDetails.businessInfo || {};
  const hasSocial = Object.values(socialLinks).some(Boolean);
  const hasBusiness = businessInfo.companyName || businessInfo.type !== 'individual';

  return (
    <>
      <div className="sellerCardHeaderRow">
        {userDetails.avatar && (
          <img src={userDetails.avatar} alt="" className="sellerCardAvatar" />
        )}
        <div>
          <p className="sellerCardName">
            {userDetails.name}
            {userDetails.verified && (
              <span className="sellerCardVerified" title="Verified">
                <VerifiedBadge size={16} />
              </span>
            )}
            {userDetails.emailVerified && <span className="sellerCardBadge" title="Email verified">📧</span>}
            {userDetails.phoneVerified && <span className="sellerCardBadge" title="Phone verified">📱</span>}
            {userDetails.idVerified && <span className="sellerCardBadge" title="ID verified">🪪</span>}
          </p>
          {badgeLevel !== 'new' && (
            <span className="sellerCardBadgeLevel">{BADGE_LABELS[badgeLevel] || badgeLevel}</span>
          )}
        </div>
      </div>
      {trustScore > 0 && (
        <div className="sellerCardTrust">
          <span className="sellerCardTrustLabel">Trust score</span>
          <div className="sellerCardTrustBar"><div className="sellerCardTrustFill" style={{ width: `${trustScore}%` }} /></div>
          <span className="sellerCardTrustValue">{trustScore}%</span>
        </div>
      )}
      {(userDetails.responseRate != null || userDetails.responseTime) && (
        <p className="sellerCardResponse">
          {userDetails.responseRate != null && `${userDetails.responseRate}% response rate`}
          {userDetails.responseTime && ` · ${userDetails.responseTime}`}
        </p>
      )}
      {(userDetails.totalAdsSold != null || userDetails.totalActiveAds != null) && (
        <p className="sellerCardStats">
          {userDetails.totalAdsSold > 0 && `${userDetails.totalAdsSold} sold`}
          {userDetails.totalActiveAds != null && userDetails.totalActiveAds > 0 && ` · ${userDetails.totalActiveAds} active ads`}
        </p>
      )}
      {userDetails.followersCount != null && userDetails.followersCount > 0 && (
        <p className="sellerCardFollowers">{Math.max(0, userDetails.followersCount)} followers</p>
      )}
      {currentUserId && userId && currentUserId !== userId && (
        <button
          type="button"
          className="sellerCardFollowBtn"
          onClick={onFollow}
          disabled={followLoading}
        >
          {following ? 'Unfollow' : 'Follow'}
        </button>
      )}
      {userDetails.memberSince && (
        <p className="sellerCardMember">
          Member since{' '}
          {typeof userDetails.memberSince === 'string'
            ? userDetails.memberSince
            : userDetails.memberSince?.toDate
              ? userDetails.memberSince
                  .toDate()
                  .toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
              : String(userDetails.memberSince)}
        </p>
      )}
      {userDetails.location?.city && (
        <p className="sellerCardLocation">
          📍 {userDetails.location.city}
          {userDetails.location.state && `, ${userDetails.location.state}`}
        </p>
      )}
      {(userDetails.companyName || hasBusiness) && (
        <p className="sellerCardCompany">
          {userDetails.companyName || businessInfo.companyName}
          {businessInfo.type && businessInfo.type !== 'individual' && ` · ${businessInfo.type}`}
        </p>
      )}
      {hasSocial && (
        <div className="sellerCardSocial">
          {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="sellerCardSocialLink">Facebook</a>}
          {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="sellerCardSocialLink">Instagram</a>}
          {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="sellerCardSocialLink">Twitter</a>}
        </div>
      )}
      {userDetails.languages && (
        <p className="sellerCardLanguages">Speaks: {userDetails.languages}</p>
      )}
      {(userDetails.ratingSum != null || userDetails.ratingCount) && (
        <p className="sellerCardRating">
          <SellerRating
            ratingSum={userDetails.ratingSum}
            ratingCount={userDetails.ratingCount}
          />
        </p>
      )}
    </>
  );
}
