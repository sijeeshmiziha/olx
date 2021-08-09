import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../contextStore/AuthContext';
import { ToastContext } from '../../../contextStore/ToastContext';
import { useSettingsData } from './useSettingsData';
import { handleExportData, saveNotifPrefs, handleChangePassword, handleDeleteAccount } from './settingsHandlers';
import { ExportDataSection, AddressesSection, NotifPrefsSection } from './SettingsSections';
import '../Settings.css';

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();
  const { addToast } = useContext(ToastContext);

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { notifPrefs, setNotifPrefs, notifPrefsLoading, setNotifPrefsLoading, addresses, addressesLoading } = useSettingsData(user);

  const isEmailProvider = user?.providerData?.[0]?.providerId === 'password';
  const isAnonymous = user?.isAnonymous;

  const onExport = () => handleExportData(user, addToast);
  const onSaveNotifPrefs = (next) => saveNotifPrefs(user, next, setNotifPrefs, setNotifPrefsLoading);
  const onSubmitPassword = (e) => handleChangePassword(e, user, passwordForm, setPasswordForm, setPasswordLoading, setPasswordError, addToast);
  const onSubmitDelete = (e) =>
    handleDeleteAccount(e, user, setUser, isEmailProvider, isAnonymous, deleteConfirm, deletePassword, setDeleteLoading, addToast, history);

  return (
    <div className="dashboardSettings">
      <h2 className="dashboardSettingsTitle">Account settings</h2>
      <ExportDataSection onExport={onExport} />
      <AddressesSection addresses={addresses} loading={addressesLoading} />
      <NotifPrefsSection notifPrefs={notifPrefs} loading={notifPrefsLoading} onToggle={onSaveNotifPrefs} />

      {isEmailProvider && (
        <section className="dashboardSettingsSection">
          <h3>Change password</h3>
          <form onSubmit={onSubmitPassword}>
            <label htmlFor="current-pw">Current password</label>
            <input id="current-pw" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} required />
            <label htmlFor="new-pw">New password</label>
            <input id="new-pw" type="password" value={passwordForm.new} onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))} required minLength={6} />
            <label htmlFor="confirm-pw">Confirm new password</label>
            <input id="confirm-pw" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} required />
            {passwordError && <p className="settingsError">{passwordError}</p>}
            <button type="submit" disabled={passwordLoading}>{passwordLoading ? 'Updating...' : 'Update password'}</button>
          </form>
        </section>
      )}

      <section className="dashboardSettingsSection">
        <h3>Danger zone</h3>
        <p className="settingsHint">Deleting your account will remove your profile and data. This cannot be undone.</p>
        <form onSubmit={onSubmitDelete}>
          <label htmlFor="delete-confirm">Type DELETE to confirm</label>
          <input id="delete-confirm" type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
          {isEmailProvider && (
            <>
              <label htmlFor="delete-password">Current password</label>
              <input id="delete-password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Your password" />
            </>
          )}
          <button type="submit" className="settingsDeleteBtn" disabled={deleteLoading || deleteConfirm !== 'DELETE' || (isEmailProvider && !deletePassword)}>
            {deleteLoading ? 'Deleting...' : 'Delete my account'}
          </button>
        </form>
      </section>
    </div>
  );
}
