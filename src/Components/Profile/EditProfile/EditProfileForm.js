import React from 'react';
import { STATES, getCitiesForState } from '../../../data/locations';
import { LinesSkeleton } from '../../UI/Skeleton';

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );
}

export default function EditProfileForm({
  user,
  loaded,
  saving,
  uploading,
  onSubmit,
  // Form state
  name, setName,
  phone, setPhone,
  about, setAbout,
  avatar, setAvatar,
  profileState, setProfileState,
  profileCity, setProfileCity,
  companyName, setCompanyName,
  languages, setLanguages,
  gender, setGender,
  website, setWebsite,
  coverPhoto, setCoverPhoto,
  alternatePhone, setAlternatePhone,
  preferredLanguage, setPreferredLanguage,
  businessInfo, setBusinessInfo,
  socialLinks, setSocialLinks,
  privacySettings, setPrivacySettings,
  // Avatar upload
  fileInputRef,
  avatarPreview,
  handleAvatarSelect,
  removeAvatar,
  uploading: avatarUploading,
}) {
  const initial = (name || user?.displayName || 'U').charAt(0).toUpperCase();
  const displayAvatar = avatarPreview || avatar;

  if (!loaded) return <LinesSkeleton count={4} />;

  return (
    <form onSubmit={onSubmit} className="epForm">
      <div className="epAvatarSection">
        <button
          type="button"
          className="epAvatarWrap"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          aria-label="Change profile picture"
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt="Profile" className="epAvatarImg" />
          ) : (
            <span className="epAvatarPlaceholder">{initial}</span>
          )}
          <span className="epAvatarOverlay"><CameraIcon /></span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="epHiddenInput" />
        <div className="epAvatarActions">
          <button type="button" className="epBtn epBtnPrimary epBtnSmall epBtnRound" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            {displayAvatar ? 'Change photo' : 'Upload photo'}
          </button>
          {displayAvatar && (
            <button type="button" className="epBtn epBtnDanger epBtnSmall epBtnRound" onClick={() => { removeAvatar(); setAvatar(null); }}>
              Remove
            </button>
          )}
        </div>
        {avatarUploading && <p className="epHintAccent">Uploading...</p>}
        <p className="epHintMuted">Max 2 MB &middot; JPG, PNG or GIF</p>
      </div>

      <div className="epField">
        <label htmlFor="edit-profile-name" className="epLabel">Name</label>
        <input id="edit-profile-name" type="text" className="epInput" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-phone" className="epLabel">Phone</label>
        <input id="edit-profile-phone" type="tel" className="epInput" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-about" className="epLabel">About</label>
        <textarea id="edit-profile-about" className="epInput epTextarea" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tell buyers a little about yourself..." rows={3} />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-gender" className="epLabel">Gender <span className="epLabelOptional">(optional)</span></label>
        <select id="edit-profile-gender" className="epInput" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Prefer not to say</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-state" className="epLabel">Location <span className="epLabelOptional">(visible on your profile)</span></label>
        <div className="epLocationRow">
          <select id="edit-profile-state" className="epInput" value={profileState} onChange={(e) => { setProfileState(e.target.value); setProfileCity(''); }}>
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select id="edit-profile-city" className="epInput" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} disabled={!profileState}>
            <option value="">Select city</option>
            {getCitiesForState(profileState).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-languages" className="epLabel">Languages spoken <span className="epLabelOptional">(helps buyers connect)</span></label>
        <input id="edit-profile-languages" type="text" className="epInput" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Hindi, Malayalam" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-company" className="epLabel">Company / Business name <span className="epLabelOptional">(optional)</span></label>
        <input id="edit-profile-company" type="text" className="epInput" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your business or shop name" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-website" className="epLabel">Website / Social link <span className="epLabelOptional">(optional)</span></label>
        <input id="edit-profile-website" type="url" className="epInput" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-coverPhoto" className="epLabel">Cover photo URL</label>
        <input id="edit-profile-coverPhoto" type="url" className="epInput" value={coverPhoto || ''} onChange={(e) => setCoverPhoto(e.target.value || null)} placeholder="https://..." />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-alternatePhone" className="epLabel">Alternate phone</label>
        <input id="edit-profile-alternatePhone" type="tel" className="epInput" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} placeholder="Optional" />
      </div>
      <div className="epField">
        <label htmlFor="edit-profile-preferredLanguage" className="epLabel">Preferred language</label>
        <select id="edit-profile-preferredLanguage" className="epInput" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="ml">Malayalam</option>
          <option value="kn">Kannada</option>
        </select>
      </div>

      <h3 className="epSectionTitle">Business (optional)</h3>
      <div className="epField">
        <label className="epLabel">Type</label>
        <select className="epInput" value={businessInfo.type} onChange={(e) => setBusinessInfo((p) => ({ ...p, type: e.target.value }))}>
          <option value="individual">Individual</option>
          <option value="dealer">Dealer</option>
          <option value="business">Business</option>
        </select>
      </div>
      <div className="epField">
        <label className="epLabel">GST number</label>
        <input type="text" className="epInput" value={businessInfo.gstNumber} onChange={(e) => setBusinessInfo((p) => ({ ...p, gstNumber: e.target.value }))} placeholder="Optional" />
      </div>
      <div className="epField">
        <label className="epLabel">Shop address</label>
        <input type="text" className="epInput" value={businessInfo.shopAddress} onChange={(e) => setBusinessInfo((p) => ({ ...p, shopAddress: e.target.value }))} placeholder="Optional" />
      </div>
      <div className="epField">
        <label className="epLabel">Business hours</label>
        <input type="text" className="epInput" value={businessInfo.businessHours} onChange={(e) => setBusinessInfo((p) => ({ ...p, businessHours: e.target.value }))} placeholder="e.g. Mon-Sat 10AM-8PM" />
      </div>

      <h3 className="epSectionTitle">Social links</h3>
      {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((key) => (
        <div key={key} className="epField">
          <label className="epLabel">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          <input type="url" className="epInput" value={socialLinks[key] || ''} onChange={(e) => setSocialLinks((p) => ({ ...p, [key]: e.target.value }))} placeholder={`https://${key}.com/...`} />
        </div>
      ))}

      <h3 className="epSectionTitle">Privacy</h3>
      <div className="epCheckboxRow">
        <input id="ep-privacy-showPhone" type="checkbox" checked={privacySettings.showPhone} onChange={(e) => setPrivacySettings((p) => ({ ...p, showPhone: e.target.checked }))} />
        <label htmlFor="ep-privacy-showPhone">Show phone to buyers</label>
      </div>
      <div className="epCheckboxRow">
        <input id="ep-privacy-showEmail" type="checkbox" checked={privacySettings.showEmail} onChange={(e) => setPrivacySettings((p) => ({ ...p, showEmail: e.target.checked }))} />
        <label htmlFor="ep-privacy-showEmail">Show email to buyers</label>
      </div>
      <div className="epCheckboxRow">
        <input id="ep-privacy-showLocation" type="checkbox" checked={privacySettings.showLocation} onChange={(e) => setPrivacySettings((p) => ({ ...p, showLocation: e.target.checked }))} />
        <label htmlFor="ep-privacy-showLocation">Show location</label>
      </div>
      <div className="epField">
        <label className="epLabel">Who can message you</label>
        <select className="epInput" value={privacySettings.allowMessages} onChange={(e) => setPrivacySettings((p) => ({ ...p, allowMessages: e.target.value }))}>
          <option value="everyone">Everyone</option>
          <option value="verified_only">Verified only</option>
          <option value="nobody">Nobody</option>
        </select>
      </div>

      <button type="submit" className="epBtn epBtnPrimary epBtnLarge" disabled={saving || avatarUploading}>
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}
