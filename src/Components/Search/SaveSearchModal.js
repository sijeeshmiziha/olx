import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contextStore/AuthContext';
import { savedSearchesRef } from '../../firebase/collections';
import { ToastContext } from '../../contextStore/ToastContext';
import { serverTimestamp } from '../../firebase/collections';
import ButtonSpinner from '../UI/ButtonSpinner';
import './SaveSearch.css';

function SaveSearchModal({ query, filters, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [name, setName] = useState('');
  const [notifyOnNew, setNotifyOnNew] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      addToast('Enter a name for this search', 'error');
      return;
    }
    if (!user?.uid) {
      addToast('Please log in to save searches', 'error');
      return;
    }
    setLoading(true);
    savedSearchesRef()
      .add({
        userId: user.uid,
        name: trimmed,
        filters: {
          query: query || '',
          category: filters?.category || '',
          subcategory: filters?.subcategory || '',
          minPrice: filters?.minPrice ?? '',
          maxPrice: filters?.maxPrice ?? '',
          state: filters?.state || '',
          city: filters?.city || '',
          condition: filters?.condition || '',
          datePosted: filters?.datePosted || '',
          adType: filters?.adType || '',
        },
        notifyOnNew: Boolean(notifyOnNew),
        frequency: frequency || 'daily',
        isActive: true,
        lastNotified: null,
        createdAt: serverTimestamp(),
      })
      .then(() => {
        addToast('Search saved!', 'success');
        onSuccess && onSuccess();
        onClose();
      })
      .catch(() => addToast('Failed to save search', 'error'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="saveSearchOverlay" onClick={onClose}>
      <div className="saveSearchModal" onClick={(e) => e.stopPropagation()}>
        <h3>Save this search</h3>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cheap iPhones"
          />
          <label className="saveSearchCheck">
            <input
              type="checkbox"
              checked={notifyOnNew}
              onChange={(e) => setNotifyOnNew(e.target.checked)}
            />
            Notify me when new ads match
          </label>
          {notifyOnNew && (
            <label className="saveSearchFrequency">
              Frequency
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
          )}
          <div className="saveSearchActions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading && <ButtonSpinner />}Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveSearchModal;
