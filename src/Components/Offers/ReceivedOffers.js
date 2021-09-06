import React, { useContext, useState, useMemo } from 'react';
import { OfferContext } from '../../contextStore/OfferContext';
import OfferCard from './OfferCard';
import './OffersPage.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'countered', label: 'Countered' },
  { value: 'rejected', label: 'Declined' },
];

function ReceivedOffers() {
  const { receivedOffers } = useContext(OfferContext);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return receivedOffers;
    return receivedOffers.filter((o) => o.status === filter);
  }, [receivedOffers, filter]);

  const counts = useMemo(() => {
    const c = { pending: 0, accepted: 0, countered: 0, rejected: 0 };
    receivedOffers.forEach((o) => {
      if (c[o.status] !== undefined) c[o.status]++;
    });
    return c;
  }, [receivedOffers]);

  const pendingCount = counts.pending;

  return (
    <div className="offersPage">
      {/* Header */}
      <div className="offersPage__header">
        <div className="offersPage__headerTop">
          <div>
            <h2 className="offersPage__title">
              Received Offers
              {pendingCount > 0 && (
                <span className="offersPage__pendingBadge">{pendingCount} new</span>
              )}
            </h2>
            <p className="offersPage__subtitle">Offers buyers have sent on your ads</p>
          </div>
          {receivedOffers.length > 0 && (
            <span className="offersPage__count">{receivedOffers.length}</span>
          )}
        </div>

        {/* Stats */}
        {receivedOffers.length > 0 && (
          <div className="offersPage__stats">
            <div className="offersPage__stat offersPage__stat--pending">
              <span className="offersPage__statValue">{counts.pending}</span>
              <span className="offersPage__statLabel">Pending</span>
            </div>
            <div className="offersPage__stat offersPage__stat--accepted">
              <span className="offersPage__statValue">{counts.accepted}</span>
              <span className="offersPage__statLabel">Accepted</span>
            </div>
            <div className="offersPage__stat offersPage__stat--countered">
              <span className="offersPage__statValue">{counts.countered}</span>
              <span className="offersPage__statLabel">Countered</span>
            </div>
            <div className="offersPage__stat offersPage__stat--rejected">
              <span className="offersPage__statValue">{counts.rejected}</span>
              <span className="offersPage__statLabel">Declined</span>
            </div>
          </div>
        )}

        {/* Filters */}
        {receivedOffers.length > 1 && (
          <div className="offersPage__filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`offersPage__filterBtn ${filter === f.value ? 'offersPage__filterBtn--active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                {f.value !== 'all' && counts[f.value] > 0 && (
                  <span className="offersPage__filterCount">{counts[f.value]}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pending action banner */}
      {pendingCount > 0 && filter === 'all' && (
        <div className="offersPage__actionBanner">
          <div className="offersPage__actionBannerIcon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="offersPage__actionBannerText">
            <strong>{pendingCount} offer{pendingCount > 1 ? 's' : ''} awaiting your response</strong>
            <span>Review and respond to keep buyers interested</span>
          </div>
        </div>
      )}

      {/* Content */}
      {receivedOffers.length === 0 ? (
        <div className="offersPage__empty">
          <div className="offersPage__emptyIcon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="offersPage__emptyTitle">No offers received yet</h3>
          <p className="offersPage__emptyText">
            When buyers make offers on your ads, they&apos;ll appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="offersPage__empty offersPage__empty--small">
          <p className="offersPage__emptyText">No {filter} offers found.</p>
        </div>
      ) : (
        <div className="offersPage__list">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} isSeller />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceivedOffers;
