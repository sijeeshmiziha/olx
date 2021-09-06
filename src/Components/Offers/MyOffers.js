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

function MyOffers() {
  const { sentOffers } = useContext(OfferContext);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return sentOffers;
    return sentOffers.filter((o) => o.status === filter);
  }, [sentOffers, filter]);

  const counts = useMemo(() => {
    const c = { pending: 0, accepted: 0, countered: 0, rejected: 0 };
    sentOffers.forEach((o) => {
      if (c[o.status] !== undefined) c[o.status]++;
    });
    return c;
  }, [sentOffers]);

  return (
    <div className="offersPage">
      {/* Header */}
      <div className="offersPage__header">
        <div className="offersPage__headerTop">
          <div>
            <h2 className="offersPage__title">My Offers</h2>
            <p className="offersPage__subtitle">Offers you&apos;ve sent to sellers</p>
          </div>
          {sentOffers.length > 0 && (
            <span className="offersPage__count">{sentOffers.length}</span>
          )}
        </div>

        {/* Stats */}
        {sentOffers.length > 0 && (
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
        {sentOffers.length > 1 && (
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

      {/* Content */}
      {sentOffers.length === 0 ? (
        <div className="offersPage__empty">
          <div className="offersPage__emptyIcon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <h3 className="offersPage__emptyTitle">No offers sent yet</h3>
          <p className="offersPage__emptyText">
            Browse listings and make your first offer to start negotiating.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="offersPage__empty offersPage__empty--small">
          <p className="offersPage__emptyText">No {filter} offers found.</p>
        </div>
      ) : (
        <div className="offersPage__list">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} isSeller={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOffers;
