import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import { getAddressesForUser, addressesRef, serverTimestamp } from '../firebase/collections';
import { STATES, getCitiesForState } from '../data/locations';
import './Addresses.css';

function AddressesPage() {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: '',
    fullAddress: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAddressesForUser(user.uid)
      .get()
      .then((snap) => {
        setAddresses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    addressesRef()
      .add({
        userId: user.uid,
        ...form,
        createdAt: serverTimestamp(),
      })
      .then(() => {
        setForm({ label: '', fullAddress: '', area: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
        return getAddressesForUser(user.uid).get();
      })
      .then((snap) => setAddresses(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setSaving(false));
  };

  if (!user) {
    return (
      <Layout>
        <div className="addressesPage">
          <p>Please log in to manage addresses.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="addressesPage">
        <h1>Saved addresses</h1>
        <form className="addressesForm" onSubmit={handleSubmit}>
          <h3>Add address</h3>
          <input
            type="text"
            placeholder="Label (e.g. Home, Office)"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          />
          <textarea
            placeholder="Full address"
            value={form.fullAddress}
            onChange={(e) => setForm((p) => ({ ...p, fullAddress: e.target.value }))}
            rows={2}
          />
          <input
            type="text"
            placeholder="Area"
            value={form.area}
            onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
          />
          <select
            value={form.state}
            onChange={(e) => setForm((p) => ({ ...p, state: e.target.value, city: '' }))}
          >
            <option value="">State</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            disabled={!form.state}
          >
            <option value="">City</option>
            {getCitiesForState(form.state).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Landmark"
            value={form.landmark}
            onChange={(e) => setForm((p) => ({ ...p, landmark: e.target.value }))}
          />
          <label>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
            />
            Default address
          </label>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add address'}</button>
        </form>
        {loading ? (
          <p>Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="addressesEmpty">No saved addresses.</p>
        ) : (
          <ul className="addressesList">
            {addresses.map((addr) => (
              <li key={addr.id} className="addressesItem">
                {addr.label && <strong>{addr.label}</strong>}
                <p>{addr.fullAddress || [addr.area, addr.city, addr.state].filter(Boolean).join(', ')}</p>
                {addr.pincode && <span>Pincode: {addr.pincode}</span>}
                {addr.isDefault && <span className="addressesDefaultBadge">Default</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default AddressesPage;
