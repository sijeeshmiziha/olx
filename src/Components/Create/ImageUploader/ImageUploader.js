import React from 'react';
import { useImageUploader } from './useImageUploader';
import ImageThumbnail from './ImageThumbnail';
import { MAX_IMAGES } from './ImageUploaderConstants';
import '../ImageUploader.css';

export default function ImageUploader({ images, onChange }) {
  const {
    list,
    canAdd,
    fileRef,
    dragOver,
    previews,
    toast,
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
  } = useImageUploader(images, onChange);

  const isEmpty = list.length === 0;

  return (
    <div className="imgUp">
      <div className="imgUp-header">
        <div className="imgUp-headerLeft">
          <svg className="imgUp-headerIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <div>
            <span className="imgUp-title">Upload photos</span>
            <span className="imgUp-subtitle">{list.length}/{MAX_IMAGES} — First image is the cover photo</span>
          </div>
        </div>
        {list.length > 0 && <span className="imgUp-badge">{list.length} added</span>}
      </div>

      {isEmpty ? (
        <button
          type="button"
          className={`imgUp-dropzone ${dragOver ? 'imgUp-dropzone--active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="imgUp-dropzoneInner">
            <div className="imgUp-dropzoneIconWrap">
              <svg className="imgUp-dropzoneIcon" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="8" fill="#EEF7F8" stroke="#002f34" strokeWidth="1.5" />
                <path d="M24 16v16M16 24h16" stroke="#002f34" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="imgUp-dropzoneText"><strong>Drag & drop</strong> your photos here</p>
            <p className="imgUp-dropzoneSub">or click to browse files</p>
            <span className="imgUp-dropzoneHint">JPG, PNG, WebP, GIF — max 10 MB each, up to 12 photos</span>
          </div>
        </button>
      ) : (
        <ul
          className={`imgUp-grid ${dragOver ? 'imgUp-grid--dragover' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {list.map((item, idx) => (
            <ImageThumbnail
              key={item instanceof File ? `${item.name}-${item.size}-${item.lastModified}` : `url-${String(item).slice(-20)}`}
              item={item}
              index={idx}
              previewUrl={previews[idx]}
              isCover={idx === 0}
              isDragging={dragIndex === idx}
              isDropTarget={dropIndex === idx && dragIndex !== idx}
              formatSize={formatSize}
              onSetAsCover={setAsCover}
              onRemove={remove}
              onDragStart={handleThumbDragStart}
              onDragOver={handleThumbDragOver}
              onDrop={handleThumbDrop}
              onDragEnd={handleThumbDragEnd}
            />
          ))}
          {canAdd && (
            <li className="imgUp-addItem">
              <button type="button" className="imgUp-addBtn" onClick={() => fileRef.current?.click()}>
                <svg className="imgUp-addIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add more</span>
                <span className="imgUp-addCount">{list.length}/{MAX_IMAGES}</span>
              </button>
            </li>
          )}
        </ul>
      )}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleFileInput} style={{ display: 'none' }} />

      {toast && (
        <div className={`imgUp-toast imgUp-toast--${toast.type}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.9 12H7.1V7h1.8v5zm0-6.5H7.1V3.7h1.8v1.8z" />
          </svg>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export { MAX_IMAGES };
