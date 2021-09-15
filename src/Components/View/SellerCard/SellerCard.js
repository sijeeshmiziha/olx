import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import BlockButton from '../../BlockUser/BlockButton';
import { AuthContext } from '../../../contextStore/AuthContext';
import { useFollow } from '../../../hooks/useFollow';
import { maskPhone } from '../../../utils/formatters';
import SellerInfo from './SellerInfo';
import '../SellerCard.css';

function SellerCard({
  userDetails,
  userId,
  product,
  viewerIsPremium = false,
  onChatClick,
  onOfferClick,
  chatLoading,
  showOfferButton,
}) {
  const { user } = useContext(AuthContext);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const { following, loading: followLoading, toggle: handleFollow } = useFollow(user?.uid, userId);

  const contactPreference = product?.contactPreference || 'both';
  const showPhone = contactPreference === 'phone' || contactPreference === 'both';
  const hasPhone = showPhone && !!userDetails?.phone;
  const showFullPhone = phoneRevealed && viewerIsPremium;

  if (!userDetails) return null;

  return (
    <div className="sellerCard">
      <p className="sellerCardTitle">Seller description</p>
      <div className="sellerCardBody">
        <SellerInfo
          userDetails={userDetails}
          userId={userId}
          currentUserId={user?.uid}
          following={following}
          followLoading={followLoading}
          onFollow={handleFollow}
        />
        {hasPhone && (
          <div className="sellerCardPhone">
            <span className="sellerCardPhoneValue">
              {showFullPhone ? userDetails.phone : maskPhone(userDetails.phone)}
            </span>
            {showFullPhone ? (
              (() => {
                const digits = String(userDetails.phone).replace(/\D/g, '');
                const waNum = digits.length === 10 ? '91' + digits : digits.startsWith('91') ? digits : '91' + digits;
                return (
                  <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" className="sellerCardWhatsApp">
                    Contact via WhatsApp
                  </a>
                );
              })()
            ) : phoneRevealed ? (
              <p className="sellerCardPhoneUpgrade">Upgrade to a paid plan to see the full number.</p>
            ) : (
              <button type="button" className="sellerCardShowPhone" onClick={() => setPhoneRevealed(true)}>
                Show phone number
              </button>
            )}
          </div>
        )}
        <div className="sellerCardActions">
          {userId && (
            <div className="sellerCardProfileLinks">
              <Link to={`/profile/${userId}`} className="sellerCardProfileLink">View profile</Link>
              <Link to={`/seller/${userId}/store`} className="sellerCardProfileLink">View store</Link>
            </div>
          )}
          {onChatClick && (
            <button type="button" className="sellerCardChatBtn" onClick={onChatClick} disabled={chatLoading}>
              {chatLoading ? '...' : 'Chat with Seller'}
            </button>
          )}
          {onOfferClick && showOfferButton && (
            <button type="button" className="sellerCardOfferBtn" onClick={onOfferClick}>
              Make an Offer
            </button>
          )}
        </div>
        <BlockButton userId={userId} userName={userDetails.name} className="sellerCardBlock" />
      </div>
    </div>
  );
}

export default SellerCard;
