import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { MAX_IMAGES, MAX_FILE_SIZE, ACCEPTED_TYPES } from './ImageUploaderConstants';

export function useImageUploader(images, onChange) {
  const list = useMemo(() => (Array.isArray(images) ? images : []), [images]);
  const canAdd = list.length < MAX_IMAGES;
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [previews, setPreviews] = useState([]);

  const listKey = list
    .map((i) => (i instanceof File ? `${i.name}:${i.size}:${i.lastModified}` : i))
    .join('|');

  useEffect(() => {
    const urls = list.map((item) => {
      if (item instanceof File) return URL.createObjectURL(item);
      if (typeof item === 'string') return item;
      return null;
    });
    setPreviews(urls);
    return () => {
      urls.forEach((u) => {
        if (u && !list.some((item) => typeof item === 'string' && item === u)) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listKey is stable fingerprint to avoid unnecessary revokes
  }, [listKey]);

  const showToast = useCallback((msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const processFiles = useCallback(
    (fileList) => {
      const newList = [...list];
      let rejected = 0;
      let sizeRejected = 0;
      for (let i = 0; i < fileList.length && newList.length < MAX_IMAGES; i++) {
        const file = fileList[i];
        if (!ACCEPTED_TYPES.includes(file.type)) { rejected++; continue; }
        if (file.size > MAX_FILE_SIZE) { sizeRejected++; continue; }
        newList.push(file);
      }
      if (rejected > 0) showToast(`${rejected} file(s) skipped — only JPG, PNG, WebP, GIF allowed`);
      else if (sizeRejected > 0) showToast(`${sizeRejected} file(s) skipped — max 10 MB per image`);
      else if (fileList.length > MAX_IMAGES - list.length) showToast(`Only ${MAX_IMAGES} images allowed — some were skipped`);
      onChange(newList.slice(0, MAX_IMAGES));
    },
    [list, onChange, showToast]
  );

  const handleFileInput = (e) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
  };

  const remove = (index) => onChange(list.filter((_, i) => i !== index));
  const setAsCover = (index) => {
    if (index === 0) return;
    const newList = [...list];
    const [item] = newList.splice(index, 1);
    newList.unshift(item);
    onChange(newList);
  };

  const handleThumbDragStart = (index) => (e) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    const ghost = document.createElement('div');
    ghost.style.opacity = '0';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => ghost.remove(), 0);
  };
  const handleThumbDragOver = (index) => (e) => { e.preventDefault(); setDropIndex(index); };
  const handleThumbDrop = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) { setDragIndex(null); setDropIndex(null); return; }
    const newList = [...list];
    const [moved] = newList.splice(dragIndex, 1);
    newList.splice(index, 0, moved);
    onChange(newList);
    setDragIndex(null);
    setDropIndex(null);
  };
  const handleThumbDragEnd = () => { setDragIndex(null); setDropIndex(null); };

  const formatSize = (file) => {
    if (!(file instanceof File)) return '';
    const kb = file.size / 1024;
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return {
    list,
    canAdd,
    fileRef,
    dragOver,
    previews,
    toast,
    MAX_IMAGES,
    processFiles,
    handleFileInput,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    remove,
    setAsCover,
    handleThumbDragStart,
    handleThumbDragOver,
    handleThumbDrop,
    handleThumbDragEnd,
    dragIndex,
    dropIndex,
    formatSize,
  };
}
