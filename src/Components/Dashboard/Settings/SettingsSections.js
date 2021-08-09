import React from 'react';
import { Link } from 'react-router-dom';

export function ExportDataSection({ onExport }) {
  return (
    <section className="dashboardSettingsSection">
      <h3>Export my data</h3>
      <p className="settingsHint">Download a copy of your profile and ads (JSON).</p>
      <button type="button" className="settingsExportBtn" onClick={onExport}>Export my data</button>
    </section>
  );
}

export function AddressesSection({ addresses, loading }) {
  return (
    <section className="dashboardSettingsSection">
      <h3>Saved addresses</h3>
      <p className="settingsHint"><Link to="/dashboard/addresses">Manage addresses</Link></p>
      {loading ? (
        <p className="settingsHint">Loading...</p>
      ) : addresses.length === 0 ? (
        <p className="settingsHint">No saved addresses. Add one from the Addresses page.</p>
      ) : (
        <ul className="settingsAddressList">
          {addresses.map((addr) => (
            <li key={addr.id} className="settingsAddressItem">
              {addr.label && <strong>{addr.label}</strong>}
              <span>{addr.fullAddress || [addr.area, addr.city, addr.state].filter(Boolean).join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function NotifPrefsSection({ notifPrefs, loading, onToggle }) {
  return (
    <section className="dashboardSettingsSection">
      <h3>Notification preferences</h3>
      <div className="settingsNotifPrefs">
        <label>
          <input type="checkbox" checked={notifPrefs.offers} onChange={(e) => onToggle({ ...notifPrefs, offers: e.target.checked })} disabled={loading} />
          Offers
        </label>
        <label>
          <input type="checkbox" checked={notifPrefs.messages} onChange={(e) => onToggle({ ...notifPrefs, messages: e.target.checked })} disabled={loading} />
          Messages
        </label>
        <label>
          <input type="checkbox" checked={notifPrefs.priceDrops} onChange={(e) => onToggle({ ...notifPrefs, priceDrops: e.target.checked })} disabled={loading} />
          Price drops
        </label>
      </div>
    </section>
  );
}
