import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import { getProductRef, adPromotionsRef, serverTimestamp } from '../firebase/collections';
import { ToastContext } from '../contextStore/ToastContext';

const PLANS = [
  { id: 'featured', label: 'Featured (7 days)', days: 7 },
  { id: 'urgent', label: 'Urgent badge (7 days)', days: 7 },
  { id: 'top', label: 'Top ad (14 days)', days: 14 },
];

function PromoteAd() {
  const { adId } = useParams();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adId || !user) return;
    getProductRef(adId)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userId === user.uid) {
          setProduct({ id: doc.id, ...doc.data() });
        }
      })
      .finally(() => setLoading(false));
  }, [adId, user]);

  const handlePromote = (planId, days) => {
    if (!user || !adId) return;
    setSaving(true);
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    adPromotionsRef()
      .add({
        productId: adId,
        userId: user.uid,
        plan: planId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status: 'active',
        createdAt: serverTimestamp(),
      })
      .then(() => {
        addToast('Promotion started.', 'success');
      })
      .catch(() => addToast('Failed to promote.', 'error'))
      .finally(() => setSaving(false));
  };

  if (!user) {
    return (
      <Layout>
        <p>Please log in.</p>
      </Layout>
    );
  }
  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!product) {
    return (
      <Layout>
        <p>Ad not found or you don&apos;t own it.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="promoteAdPage">
        <h1>Promote your ad</h1>
        <p><strong>{product.name}</strong></p>
        <div className="promotePlans">
          {PLANS.map((plan) => (
            <div key={plan.id} className="promotePlanCard">
              <h3>{plan.label}</h3>
              <button
                type="button"
                onClick={() => handlePromote(plan.id, plan.days)}
                disabled={saving}
              >
                {saving ? '...' : 'Promote'}
              </button>
            </div>
          ))}
        </div>
        <Link to={`/ad/${adId}`}>Back to ad</Link>
      </div>
    </Layout>
  );
}

export default PromoteAd;
