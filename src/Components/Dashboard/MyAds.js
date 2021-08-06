import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import { productsRef, getProductRef } from '../../firebase/collections';
import { serverTimestamp } from '../../firebase/collections/fieldValues';
import { isAdExpired } from '../../utils/adExpiry';
import PostCards from '../PostCards/PostCards';
import BarLoading from '../Loading/BarLoading';
import './Dashboard.css';

const PENDING_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function getCreatedDate(product) {
  if (!product?.createdAt) return null;
  return product.createdAt.toDate
    ? product.createdAt.toDate()
    : new Date(product.createdAt);
}

function isPendingExpired(product) {
  const created = getCreatedDate(product);
  if (!created) return true;
  return Date.now() - created.getTime() > PENDING_DURATION_MS;
}

function MyAds() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext) || {};
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const q = productsRef()
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc');
    q.get().then((snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Auto-approve ads that have been pending for more than 5 minutes
      list.forEach((product) => {
        if (
          product.moderationStatus === 'pending' &&
          isPendingExpired(product)
        ) {
          getProductRef(product.id)
            .update({ moderationStatus: 'approved', updatedAt: serverTimestamp() })
            .catch(() => {});
          product.moderationStatus = 'approved';
        }
      });
      setPosts(list);
      setLoading(false);
    });
  }, [user?.uid]);

  const draftPosts = posts.filter((p) => p.status === 'draft');
  const activePosts = posts.filter(
    (p) => (!p.status || p.status === 'active') && !isAdExpired(p)
  );
  const soldPosts = posts.filter((p) => p.status === 'sold');
  const expiredPosts = posts.filter(
    (p) => p.status === 'expired' || (p.status === 'active' && isAdExpired(p))
  );

  const handleDeleteDraft = (productId) => {
    if (deletingId) return;
    setDeletingId(productId);
    getProductRef(productId)
      .delete()
      .then(() => {
        setPosts((prev) => prev.filter((p) => p.id !== productId));
        addToast?.('Draft deleted.', 'success');
      })
      .catch(() => {
        addToast?.('Failed to delete draft.', 'error');
      })
      .finally(() => setDeletingId(null));
  };

  const handleEditDraft = (product) => {
    history.push(`/ad/${product.id}/edit`);
  };

  const handlePublishDraft = (product) => {
    if (publishingId) return;
    // Validate minimum required fields before publishing
    if (!product.name?.trim()) {
      addToast?.('Please add a title before publishing. Use "Edit" to complete your ad.', 'error');
      return;
    }
    if (!product.price && product.price !== 0) {
      addToast?.('Please add a price before publishing. Use "Edit" to complete your ad.', 'error');
      return;
    }
    const hasImages = (product.images?.length > 0) || product.url;
    if (!hasImages) {
      addToast?.('Please add at least one image before publishing. Use "Edit" to complete your ad.', 'error');
      return;
    }
    setPublishingId(product.id);
    getProductRef(product.id)
      .update({
        status: 'active',
        moderationStatus: 'pending',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      .then(() => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, status: 'active', moderationStatus: 'pending', publishedAt: new Date() }
              : p
          )
        );
        addToast?.('Ad published successfully!', 'success');
      })
      .catch(() => {
        addToast?.('Failed to publish ad. Try again.', 'error');
      })
      .finally(() => setPublishingId(null));
  };

  const displayList =
    activeTab === 'drafts'
      ? draftPosts
      : activeTab === 'active'
        ? activePosts
        : activeTab === 'sold'
          ? soldPosts
          : expiredPosts;

  return (
    <div>
      <div className="dashboardTabs dashboardTabsSub">
        <button
          type="button"
          className={`dashboardTab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activePosts.length})
        </button>
        <button
          type="button"
          className={`dashboardTab ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts ({draftPosts.length})
        </button>
        <button
          type="button"
          className={`dashboardTab ${activeTab === 'sold' ? 'active' : ''}`}
          onClick={() => setActiveTab('sold')}
        >
          Sold ({soldPosts.length})
        </button>
        <button
          type="button"
          className={`dashboardTab ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          Expired ({expiredPosts.length})
        </button>
      </div>
      {loading ? (
        <BarLoading />
      ) : displayList.length === 0 ? (
        <div className="emptyState">
          <p>
            {activeTab === 'active'
              ? 'You have no active ads. Post one from the sell button above!'
              : activeTab === 'drafts'
                ? 'No drafts saved. Use "Save as draft" when creating an ad.'
                : activeTab === 'sold'
                  ? 'No sold ads yet.'
                  : 'No expired ads.'}
          </p>
        </div>
      ) : (
        <div className="myAdsGrid">
          {displayList.map((product, index) => (
            <div
              className="dashboardCard myAdsCardWrap"
              key={product.id || index}
            >
              <PostCards product={product} index={index} />
              <div className="myAdsCardFooter">
                {product.stats && (product.stats.views > 0 || product.stats.favorites > 0) && (
                  <div className="myAdsCardStats">
                    {product.stats.views > 0 && <span>{product.stats.views} views</span>}
                    {product.stats.favorites > 0 && <span>{product.stats.favorites} favorites</span>}
                  </div>
                )}
                {product.moderationStatus === 'pending' && !isPendingExpired(product) && (
                  <div className="myAdsStatusBar myAdsStatusBar--pending">
                    <span className="myAdsStatusDot"></span> Reviewing your ad...
                  </div>
                )}
                {product.moderationStatus === 'rejected' && (
                  <div className="myAdsStatusBar myAdsStatusBar--rejected">
                    <span className="myAdsStatusDot"></span> Ad rejected
                  </div>
                )}
                {product.moderationStatus === 'flagged' && (
                  <div className="myAdsStatusBar myAdsStatusBar--flagged">
                    <span className="myAdsStatusDot"></span> Flagged for review
                  </div>
                )}
                {activeTab === 'active' && (
                  <div className="myAdsCardActions">
                    {product.featuredRequestStatus === 'approved' ? (
                      <div className="myAdsFeaturedApproved">
                        <span className="myAdsFeaturedStar">&#9733;</span> Featured
                      </div>
                    ) : product.featuredRequestStatus === 'requested' ? (
                      <div className="myAdsFeaturedPendingBar">
                        <span className="myAdsFeaturedClock">&#9203;</span> Awaiting Approval
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="myAdsRequestFeaturedBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          getProductRef(product.id)
                            .update({
                              featuredRequestStatus: 'requested',
                              featuredRequestedAt: serverTimestamp(),
                              updatedAt: serverTimestamp(),
                            })
                            .then(() => {
                              setPosts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? { ...p, featuredRequestStatus: 'requested', featuredRequestedAt: new Date() }
                                    : p
                                )
                              );
                              addToast?.('Featured request submitted!', 'success');
                            })
                            .catch(() => addToast?.('Failed to request featured. Try again.', 'error'));
                        }}
                      >
                        Request Featured
                      </button>
                    )}
                  </div>
                )}
                {activeTab === 'drafts' && (
                  <div className="myAdsDraftActions">
                    <button
                      type="button"
                      className="myAdsPublishDraftBtn"
                      disabled={publishingId === product.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublishDraft(product);
                      }}
                    >
                      {publishingId === product.id ? 'Publishing...' : 'Publish'}
                    </button>
                    <div className="myAdsDraftSecondaryActions">
                      <button
                        type="button"
                        className="myAdsEditDraftBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDraft(product);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="myAdsDeleteDraftBtn"
                        disabled={deletingId === product.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDraft(product.id);
                        }}
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'expired' && (
                  <div className="myAdsCardActions">
                    <Link
                      to={{ pathname: '/create', state: { repost: product } }}
                      className="myAdsRepostBtn"
                    >
                      Repost
                    </Link>
                  </div>
                )}
              </div>
              {activeTab === 'drafts' && (
                <span className="myAdsDraftBadge">Draft</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAds;
