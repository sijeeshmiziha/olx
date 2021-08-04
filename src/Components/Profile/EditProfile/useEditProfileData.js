import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contextStore/AuthContext';
import { getUserRef, verificationsRef } from '../../../firebase/collections';
import { migrateUserDoc } from '../../../firebase/migration';
import { COOLDOWN_DAYS } from '../../../constants';
import { daysSinceTimestamp } from './EditProfileHelpers';

const defaultBusinessInfo = {
  type: 'individual',
  gstNumber: '',
  panNumber: '',
  shopAddress: '',
  businessHours: '',
  establishedYear: '',
};
const defaultSocialLinks = {
  facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '',
};
const defaultPrivacySettings = {
  showPhone: true,
  showEmail: false,
  showLocation: true,
  showOnlineStatus: true,
  allowMessages: 'everyone',
};

export function useEditProfileData() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [profileState, setProfileState] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [languages, setLanguages] = useState('');
  const [gender, setGender] = useState('');
  const [website, setWebsite] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [alternatePhone, setAlternatePhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [businessInfo, setBusinessInfo] = useState(defaultBusinessInfo);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [privacySettings, setPrivacySettings] = useState(defaultPrivacySettings);
  const [verificationDoc, setVerificationDoc] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = getUserRef(user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const d = migrateUserDoc(doc);
        setName(d.name || '');
        setPhone(d.phone || '');
        setAbout(d.about || '');
        setAvatar(d.avatar || null);
        setIsVerified(d.verified === true);
        setProfileState(d.location?.state || '');
        setProfileCity(d.location?.city || '');
        setCompanyName(d.companyName || '');
        setLanguages(d.languages || '');
        setGender(d.gender || '');
        setWebsite(d.website || '');
        setCoverPhoto(d.coverPhoto || null);
        setAlternatePhone(d.alternatePhone || '');
        setPreferredLanguage(d.preferredLanguage || 'en');
        setBusinessInfo(d.businessInfo && typeof d.businessInfo === 'object'
          ? { type: d.businessInfo.type || 'individual', gstNumber: d.businessInfo.gstNumber || '', panNumber: d.businessInfo.panNumber || '', shopAddress: d.businessInfo.shopAddress || '', businessHours: d.businessInfo.businessHours || '', establishedYear: d.businessInfo.establishedYear ?? '' }
          : defaultBusinessInfo);
        setSocialLinks(d.socialLinks && typeof d.socialLinks === 'object'
          ? { facebook: d.socialLinks.facebook || '', instagram: d.socialLinks.instagram || '', twitter: d.socialLinks.twitter || '', linkedin: d.socialLinks.linkedin || '', youtube: d.socialLinks.youtube || '' }
          : defaultSocialLinks);
        setPrivacySettings(d.privacySettings && typeof d.privacySettings === 'object'
          ? { showPhone: d.privacySettings.showPhone !== false, showEmail: !!d.privacySettings.showEmail, showLocation: d.privacySettings.showLocation !== false, showOnlineStatus: d.privacySettings.showOnlineStatus !== false, allowMessages: d.privacySettings.allowMessages || 'everyone' }
          : defaultPrivacySettings);
      }
      setLoaded(true);
    });
    return () => unsub && unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = verificationsRef()
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot((snap) => {
        setVerificationDoc(snap.empty ? null : snap.docs[0]);
      }, () => {});
    return () => unsub && unsub();
  }, [user?.uid]);

  const vData = verificationDoc ? verificationDoc.data() : null;
  const vStatus = vData?.status || null;
  const vResolvedAt = vData?.resolvedAt || vData?.createdAt || null;
  const isResolved = vStatus === 'rejected' || vStatus === 'approved';
  const daysSinceResolved = isResolved ? daysSinceTimestamp(vResolvedAt) : Infinity;
  const daysRemaining = Math.max(0, COOLDOWN_DAYS - daysSinceResolved);
  const cooldownActive = isResolved && daysSinceResolved < COOLDOWN_DAYS;
  const canReapply = !cooldownActive;

  return {
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
    verificationDoc,
    vData, vStatus,
    cooldownActive, canReapply, daysRemaining,
  };
}
