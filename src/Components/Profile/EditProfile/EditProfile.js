import React, { useState, useContext } from 'react';
import { ToastContext } from '../../../contextStore/ToastContext';
import { getUserRef, serverTimestamp } from '../../../firebase/collections';
import VerifiedBadge from '../../UI/VerifiedBadge';
import CropPreview from './CropPreview';
import EditProfileForm from './EditProfileForm';
import EditProfileSidebar from './EditProfileSidebar';
import VerificationSection from './VerificationSection';
import { useEditProfileData } from './useEditProfileData';
import { useAvatarUpload } from './useAvatarUpload';
import { useVerification } from './useVerification';
import '../Profile.css';
import '../EditProfile.css';

export default function EditProfile() {
  const { addToast } = useContext(ToastContext);
  const [saving, setSaving] = useState(false);

  const data = useEditProfileData();
  const {
    user,
    loaded,
    name, setName,
    phone, setPhone,
    about, setAbout,
    avatar, setAvatar,
    isVerified,
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
    vStatus,
    vData,
    cooldownActive,
    canReapply,
    daysRemaining,
  } = data;

  const avatarState = useAvatarUpload(user);
  const {
    fileInputRef,
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    uploading,
  cropSrc,
  crop,
    setCrop,
    zoom,
    setZoom,
    handleAvatarSelect,
    handleCropApply,
    handleCropCancel,
    removeAvatar,
    uploadAvatar,
  } = avatarState;

  const verificationState = useVerification(
    user,
    name,
    data.verificationDoc,
    vStatus,
    vStatus === 'rejected' || vStatus === 'approved',
    cooldownActive,
    daysRemaining,
    addToast
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    try {
      let avatarUrl = avatar;
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) avatarUrl = url;
      }
      const profileData = {
        id: user.uid,
        name: name.trim(),
        phone: String(phone).trim(),
        about: about.trim(),
        email: user.email || null,
        avatar: avatarUrl || null,
        gender: gender || null,
        companyName: companyName.trim() || null,
        languages: languages.trim() || null,
        website: website.trim() || null,
        alternatePhone: String(alternatePhone).trim() || null,
        preferredLanguage: preferredLanguage || 'en',
        coverPhoto: coverPhoto || null,
        businessInfo: { ...businessInfo, establishedYear: businessInfo.establishedYear ? Number(businessInfo.establishedYear) : null },
        socialLinks: { ...socialLinks },
        privacySettings: { ...privacySettings },
        updatedAt: serverTimestamp(),
      };
      if (profileState || profileCity) {
        profileData.location = { state: profileState || null, city: profileCity || null };
      }
      await getUserRef(user.uid).set(profileData, { merge: true });
      await user.updateProfile({ displayName: name.trim(), photoURL: avatarUrl || user.photoURL || null });
      setAvatar(avatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      addToast('Profile saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save profile:', err);
      addToast('Failed to save profile. Please try again.', 'error');
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="profilePage">
        <p>Please log in to edit your profile.</p>
      </div>
    );
  }

  const verificationContent = (
    <VerificationSection
      isVerified={isVerified}
      vStatus={vStatus}
      vData={vData}
      canReapply={canReapply}
      cooldownActive={cooldownActive}
      daysRemaining={daysRemaining}
      submittingVerification={verificationState.submittingVerification}
      verificationReason={verificationState.verificationReason}
      setVerificationReason={verificationState.setVerificationReason}
      verificationIdPreview={verificationState.verificationIdPreview}
      verificationIdFile={verificationState.verificationIdFile}
      handleVerificationIdSelect={verificationState.handleVerificationIdSelect}
      verificationFileRef={verificationState.verificationFileRef}
      handleVerificationSubmit={verificationState.handleVerificationSubmit}
      setVerificationIdFile={verificationState.setVerificationIdFile}
      setVerificationIdPreview={verificationState.setVerificationIdPreview}
    />
  );

  return (
    <div className="profilePage editProfilePage">
      {cropSrc && (
        <div className="epCropModal">
          <div className="epCropContainer">
            <div className="epCropHeader">
              <h3>Crop profile photo</h3>
              <button type="button" className="epCropCloseBtn" onClick={handleCropCancel} aria-label="Cancel crop">&#10005;</button>
            </div>
            <div className="epCropArea">
              <CropPreview src={cropSrc} crop={crop} zoom={zoom} onCropChange={setCrop} onZoomChange={setZoom} />
            </div>
            <div className="epCropControls">
              <label className="epCropZoomLabel">
                <span>Zoom</span>
                <input type="range" className="epCropZoomSlider" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              </label>
            </div>
            <div className="epCropActions">
              <button type="button" className="epBtn epBtnSmall epBtnDanger" onClick={handleCropCancel}>Cancel</button>
              <button type="button" className="epBtn epBtnSmall epBtnPrimary" onClick={handleCropApply}>Apply crop</button>
            </div>
          </div>
        </div>
      )}

      <div className="epGrid">
        <div className="epCard">
          <h2 className="epCardTitle">
            Edit profile
            {(isVerified || vStatus === 'approved') && (
              <span className="epVerifiedBadge" title="Verified account"><VerifiedBadge size={20} /></span>
            )}
          </h2>
          <EditProfileForm
            user={user}
            loaded={loaded}
            saving={saving}
            uploading={uploading}
            onSubmit={handleSubmit}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            about={about}
            setAbout={setAbout}
            avatar={avatar}
            setAvatar={setAvatar}
            profileState={profileState}
            setProfileState={setProfileState}
            profileCity={profileCity}
            setProfileCity={setProfileCity}
            companyName={companyName}
            setCompanyName={setCompanyName}
            languages={languages}
            setLanguages={setLanguages}
            gender={gender}
            setGender={setGender}
            website={website}
            setWebsite={setWebsite}
            coverPhoto={coverPhoto}
            setCoverPhoto={setCoverPhoto}
            alternatePhone={alternatePhone}
            setAlternatePhone={setAlternatePhone}
            preferredLanguage={preferredLanguage}
            setPreferredLanguage={setPreferredLanguage}
            businessInfo={businessInfo}
            setBusinessInfo={setBusinessInfo}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            privacySettings={privacySettings}
            setPrivacySettings={setPrivacySettings}
            fileInputRef={fileInputRef}
            avatarPreview={avatarPreview}
            handleAvatarSelect={handleAvatarSelect}
            removeAvatar={removeAvatar}
          />
        </div>
        <EditProfileSidebar
          user={user}
          phone={phone}
          profileState={profileState}
          profileCity={profileCity}
          companyName={companyName}
          languages={languages}
          verificationContent={verificationContent}
        />
      </div>
    </div>
  );
}
