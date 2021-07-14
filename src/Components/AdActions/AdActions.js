import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { serverTimestamp } from '../../firebase/collections/fieldValues';
import { ToastContext } from '../../contextStore/ToastContext';
import ConfirmModal from './ConfirmModal';
import './AdActions.css';

function AdActions({ product, isOwner, onSold, onFeaturedRequest }) {
  const history = useHistory();
  const { addToast } = React.useContext(ToastContext) || {};
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  if (!isOwner || !product) return null;

  const handleDelete = () => {
    Firebase.firestore()
      .collection('products')
      .doc(product.id)
      .delete()
      .then(() => {
        setShowDeleteModal(false);
        history.push('/dashboard');
      });
  };

  const handleMarkSold = () => {
    Firebase.firestore()
      .collection('products')
      .doc(product.id)
      .update({
        status: 'sold',
        soldAt: serverTimestamp(),
      })
      .then(() => {
        setShowSoldModal(false);
        if (onSold) onSold();
      });
  };

  const handleRequestFeatured = () => {
    if (!product?.id) return;
    setFeaturedLoading(true);
    Firebase.firestore()
      .collection('products')
      .doc(product.id)
      .update({
        featuredRequestStatus: 'requested',
        featuredRequestedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      .then(() => {
        setFeaturedLoading(false);
        addToast?.('Featured request submitted! We will review your ad.', 'success');
        if (onFeaturedRequest) onFeaturedRequest();
      })
      .catch(() => {
        setFeaturedLoading(false);
        addToast?.('Failed to request featured. Try again.', 'error');
      });
  };

  const isSold = product.status === 'sold';
  const featuredStatus = product.featuredRequestStatus || 'none';
  const canRequestFeatured = !isSold && (featuredStatus === 'none' || featuredStatus === 'rejected');
  const isRequested = featuredStatus === 'requested';
  const isApproved = featuredStatus === 'approved';

  return (
    <>
      {/* Featured Request Section */}
      <div className="featuredRequestSection">
        <h4 className="featuredRequestTitle">Featured Ad</h4>
        {canRequestFeatured && (
          <div className="featuredRequestBox">
            <p className="featuredRequestDesc">
              Make your ad stand out! Request to feature your ad and get more visibility.
            </p>
            <button
              type="button"
              className="adActionBtn featured"
              onClick={handleRequestFeatured}
              disabled={featuredLoading}
            >
              {featuredLoading ? 'Requesting...' : 'Request Featured'}
            </button>
          </div>
        )}
        {isRequested && (
          <div className="featuredRequestBox featuredRequestBox--pending">
            <span className="featuredRequestIcon">&#9203;</span>
            <div>
              <p className="featuredRequestStatus">Featured Request Pending</p>
              <p className="featuredRequestHint">Your request is being reviewed. This usually takes a few hours.</p>
            </div>
          </div>
        )}
        {isApproved && (
          <div className="featuredRequestBox featuredRequestBox--approved">
            <span className="featuredRequestIcon">&#9733;</span>
            <div>
              <p className="featuredRequestStatus">Your Ad is Featured!</p>
              <p className="featuredRequestHint">Your ad is getting extra visibility.</p>
            </div>
          </div>
        )}
        {featuredStatus === 'rejected' && (
          <div className="featuredRequestBox featuredRequestBox--rejected">
            <p className="featuredRequestStatus">Featured request was not approved.</p>
            <p className="featuredRequestHint">You can submit a new request.</p>
          </div>
        )}
      </div>

      <div className="adActions">
        <button
          type="button"
          className="adActionBtn edit"
          onClick={() => history.push(`/ad/${product.id}/edit`)}
        >
          Edit
        </button>
        {!isSold && (
          <button
            type="button"
            className="adActionBtn sold"
            onClick={() => setShowSoldModal(true)}
          >
            Mark as Sold
          </button>
        )}
        <button
          type="button"
          className="adActionBtn delete"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete ad?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <ConfirmModal
        isOpen={showSoldModal}
        title="Mark as sold?"
        message="Your ad will be marked as sold and remain visible."
        confirmLabel="Mark sold"
        cancelLabel="Cancel"
        onConfirm={handleMarkSold}
        onCancel={() => setShowSoldModal(false)}
      />
    </>
  );
}

export default AdActions;
