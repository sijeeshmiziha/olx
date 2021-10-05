import { useState, useEffect } from 'react';
import { verificationsRef } from '../../../firebase/collections';

export function useVerificationRequests(activeTab) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = verificationsRef().orderBy('createdAt', 'desc');
    if (activeTab !== 'all') {
      query = query.where('status', '==', activeTab);
    }
    const unsub = query.limit(100).onSnapshot(
      (snap) => {
        setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load verifications:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [activeTab]);

  return { requests, loading };
}
