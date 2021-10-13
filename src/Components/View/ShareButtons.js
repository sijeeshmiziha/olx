import React, { useContext } from 'react';
import { ToastContext } from '../../contextStore/ToastContext';
import { silentCatch } from '../../utils/errorHandler';
import './ShareButtons.css';

function ShareButtons({ url, title, productId, getProductRef, increment }) {
  const { addToast } = useContext(ToastContext);
  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out this ad on OLX';

  const onShare = () => {
    if (productId && getProductRef && increment) {
      getProductRef(productId)
        .update({ 'stats.shares': increment(1) })
        .catch(silentCatch('ShareButtons:incrementShares'));
    }
  };

  const copyLink = () => {
    onShare();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => addToast('Link copied!', 'success'));
    } else {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      addToast('Link copied!', 'success');
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="shareButtons">
      <span className="shareLabel">Share:</span>
      <button type="button" className="shareBtn" onClick={copyLink}>
        Copy link
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shareBtn"
        onClick={onShare}
      >
        WhatsApp
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shareBtn"
        onClick={onShare}
      >
        Facebook
      </a>
    </div>
  );
}

export default ShareButtons;
