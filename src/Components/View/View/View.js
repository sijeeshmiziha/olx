import React, { useContext, useState } from 'react';
import { PostContext } from '../../../contextStore/PostContext';
import { AuthContext } from '../../../contextStore/AuthContext';
import { ToastContext } from '../../../contextStore/ToastContext';
import { useHistory } from 'react-router';
import { getOrCreateConversation, getProductRef, increment } from '../../../firebase/collections';
import { formatRelativeDate } from '../../../utils/formatters';
import ImageGallery from '../ImageGallery';
import AdActions from '../../AdActions/AdActions';
import FavoriteButton from '../../Favorites/FavoriteButton';
import SellerCard from '../SellerCard';
import ShareButtons from '../ShareButtons';
import SimilarAds from '../SimilarAds';
import SafetyTips from '../SafetyTips';
import ReportAd from '../ReportAd';
import MakeOfferModal from '../../Offers/MakeOfferModal';
import WatchButton from '../../Watchlist/WatchButton';
import AdAnalytics from '../../Analytics/AdAnalytics';
import PriceHistory from '../PriceHistory';
import { useViewData } from './useViewData';
import ViewMeta from './ViewMeta';
import ProductDetails from './ProductDetails';
import ProductDescription from './ProductDescription';
import '../View.css';

const ALLOWED_VIDEO_HOSTS = ['www.youtube.com', 'youtube.com', 'm.youtube.com', 'youtu.be'];

function isAllowedVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' && ALLOWED_VIDEO_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function getEmbedUrl(url) {
  if (!isAllowedVideoUrl(url)) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const v = parsed.searchParams.get('v');
    return v ? `https://www.youtube.com/embed/${v}` : null;
  } catch {
    return null;
  }
}

export default function View() {
  const { postContent, setPostContent } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext) || {};
  const [chatLoading, setChatLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const history = useHistory();

  const { userDetails, viewerIsPremium } = useViewData(postContent, history, user?.uid);

  if (!postContent || postContent.userId === undefined) return null;

  const imageList = postContent?.images?.length > 0 ? postContent.images : postContent?.url ? [postContent.url] : [];
  const isOwner = user && postContent && user.uid === postContent.userId;
  const createdDate = postContent?.createdAt != null
    ? (postContent.createdAt?.toDate ? postContent.createdAt.toDate() : postContent.createdAt)
    : null;
  const dateLabel = formatRelativeDate(createdDate) || (postContent?.createdAt && String(postContent.createdAt));
  const description = postContent.description || '';
  const showReadMore = description.length > 200;

  const handleChatWithSeller = () => {
    if (!user) { history.push('/login'); return; }
    if (isOwner) return;
    setChatLoading(true);
    getOrCreateConversation(
      user.uid,
      postContent.userId,
      postContent.id,
      postContent.name,
      postContent.thumbnailUrl || postContent.images?.[0] || postContent.url,
      postContent.price
    )
      .then((convId) => { if (convId) history.push(`/chat/${convId}`); })
      .catch((err) => {
        console.error('View: failed to create or get conversation', err);
        addToast?.(err?.message || 'Could not start chat. Please try again.', 'error');
      })
      .finally(() => setChatLoading(false));
  };

  return (
    <div className="viewParentDiv olxFadeIn">
      <ViewMeta postContent={postContent} imageList={imageList} />
      <div className="viewTopRow">
        <div className="imageShowDiv">
          <div className="viewFavoriteWrap">
            <FavoriteButton productId={postContent.id} />
            {!isOwner && <WatchButton productId={postContent.id} productName={postContent.name} currentPrice={postContent.price} />}
          </div>
          <ImageGallery images={imageList} />
        </div>
        <div className="rightSection">
          <ProductDetails postContent={postContent} dateLabel={dateLabel} />
          {postContent.videoUrl && (
            <div className="viewVideoSection">
              <p className="p-bold">Video</p>
              {(() => {
                const embedUrl = getEmbedUrl(postContent.videoUrl);
                if (embedUrl) {
                  return (
                    <iframe
                      title="Ad video"
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="viewVideoEmbed"
                    />
                  );
                }
                const safe = isAllowedVideoUrl(postContent.videoUrl)
                  ? postContent.videoUrl
                  : null;
                return safe ? (
                  <a href={safe} target="_blank" rel="noopener noreferrer" className="viewVideoLink">Watch video</a>
                ) : (
                  <span className="viewVideoLink">Video link not available</span>
                );
              })()}
            </div>
          )}
          {userDetails && (
            <SellerCard
              userDetails={userDetails}
              userId={postContent.userId}
              product={postContent}
              viewerIsPremium={viewerIsPremium}
              onChatClick={!isOwner ? handleChatWithSeller : undefined}
              onOfferClick={!isOwner ? () => setShowOfferModal(true) : undefined}
              chatLoading={chatLoading}
              showOfferButton={postContent.status !== 'sold'}
            />
          )}
          {!user && !isOwner && <p className="viewLoginToChat">Log in to chat with the seller.</p>}
          <ProductDescription
            description={description}
            showReadMore={showReadMore}
            expanded={descriptionExpanded}
            onToggle={() => setDescriptionExpanded(true)}
          />
          <PriceHistory productId={postContent.id} />
          {isOwner && (
            <>
              <AdAnalytics product={postContent} />
              <AdActions
                product={postContent}
                isOwner={isOwner}
                onSold={() => setPostContent({ ...postContent, status: 'sold', soldAt: new Date() })}
                onFeaturedRequest={() =>
                  setPostContent({
                    ...postContent,
                    featuredRequestStatus: 'requested',
                    featuredRequestedAt: new Date(),
                  })
                }
              />
            </>
          )}
          <ShareButtons title={postContent.name} productId={postContent.id} getProductRef={getProductRef} increment={increment} />
          <SafetyTips />
          {!isOwner && user && (
            <button type="button" className="reportAdLink" onClick={() => setShowReportModal(true)}>Report this ad</button>
          )}
        </div>
      </div>
      <div className="viewSimilarSection">
        <SimilarAds category={postContent.category} excludeId={postContent.id} limit={8} />
      </div>
      {showReportModal && <ReportAd productId={postContent.id} reporterId={user?.uid} onClose={() => setShowReportModal(false)} />}
      {showOfferModal && <MakeOfferModal product={postContent} onClose={() => setShowOfferModal(false)} />}
    </div>
  );
}
