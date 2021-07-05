import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PostContext } from '../../contextStore/PostContext';
import { formatPrice, formatRelativeDate } from '../../utils/formatters';
import FavoriteButton from '../Favorites/FavoriteButton';
import './postcards.css';

function PostCards({ product, index }) {
  const { setPostContent } = useContext(PostContext);
  const history = useHistory();
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = product?.images?.[0] || product?.url;

  const locationLabel = [product?.location?.city, product?.location?.state]
    .filter(Boolean)
    .join(', ');

  const isSold = product?.status === 'sold';

  const isBoosted =
    product?.isBoosted &&
    (() => {
      const expiry = product.boostExpiry;
      if (!expiry) return true;
      const expDate = expiry.toDate ? expiry.toDate() : new Date(expiry);
      return expDate > new Date();
    })();

  const createdDate =
    product?.createdAt != null
      ? product.createdAt && typeof product.createdAt.toDate === 'function'
        ? product.createdAt.toDate()
        : product.createdAt
      : null;
  const dateLabel =
    formatRelativeDate(createdDate) || formatRelativeDate(product?.createdAt);

  const handleClick = () => {
    setPostContent(product);
    history.push(product?.id ? `/ad/${product.id}` : '/view');
  };

  return (
    <div className="card" key={product?.id || index} onClick={handleClick}>
      <div className="cardImageWrap">
        {isSold && <span className="cardSoldBadge">SOLD</span>}
        {isBoosted && !isSold && (
          <span className="cardFeaturedBadge">FEATURED</span>
        )}
        <div className="cardFavorite" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton productId={product?.id} />
        </div>
        <div className="cardImage">
          {!imgLoaded && <div className="cardImagePlaceholder" />}
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        </div>
      </div>
      <div className="cardContent">
        <p className="cardPrice">{formatPrice(product?.price)}</p>
        <p className="cardName">{product?.name}</p>
        <div className="cardMeta">
          {locationLabel && (
            <span className="cardLocation">{locationLabel}</span>
          )}
          {dateLabel && <span className="cardDate">{dateLabel}</span>}
        </div>
      </div>
    </div>
  );
}

export default PostCards;
