import { useState, useRef, useCallback, useContext } from 'react';
import { ToastContext } from '../../../contextStore/ToastContext';
import { Firebase } from '../../../firebase/config';
import { AVATAR_MAX_SIZE_BYTES, AVATAR_CROP_SIZE } from '../../../constants';
import { getCroppedImg } from './EditProfileHelpers';

export function useAvatarUpload(user) {
  const { addToast } = useContext(ToastContext);
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleAvatarSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }
    if (file.size > AVATAR_MAX_SIZE_BYTES) {
      addToast('Image must be less than 5 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropSrc(ev.target.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropApply = useCallback(async () => {
    if (!cropSrc) return;
    try {
      const blob = await getCroppedImg(cropSrc, crop, zoom, AVATAR_CROP_SIZE);
      const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      setAvatarFile(croppedFile);
      setAvatarPreview(URL.createObjectURL(blob));
      setCropSrc(null);
    } catch (err) {
      console.error('Crop failed:', err);
      addToast('Failed to crop image. Please try again.', 'error');
    }
  }, [cropSrc, crop, zoom, addToast]);

  const handleCropCancel = () => setCropSrc(null);

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user?.uid) return null;
    setUploading(true);
    try {
      const storageRef = Firebase.storage().ref(`profiles/${user.uid}/avatar.jpg`);
      await storageRef.put(avatarFile);
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      return url;
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setUploading(false);
      return null;
    }
  };

  return {
    fileInputRef,
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    uploading,
    cropSrc,
    setCropSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    handleAvatarSelect,
    handleCropApply,
    handleCropCancel,
    removeAvatar,
    uploadAvatar,
  };
}
