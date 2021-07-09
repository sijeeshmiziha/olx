import React from 'react';

export default function ImageThumbnail({
  item,
  index,
  previewUrl,
  isCover,
  isDragging,
  isDropTarget,
  formatSize,
  onSetAsCover,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  return (
    <li
      className={`imgUp-thumb ${isCover ? 'imgUp-thumb--cover' : ''} ${isDragging ? 'imgUp-thumb--dragging' : ''} ${isDropTarget ? 'imgUp-thumb--dropTarget' : ''}`}
      draggable
      onDragStart={onDragStart(index)}
      onDragOver={onDragOver(index)}
      onDrop={onDrop(index)}
      onDragEnd={onDragEnd}
    >
      <img src={previewUrl} alt={`Upload ${index + 1}`} className="imgUp-thumbImg" />
      {isCover && (
        <span className="imgUp-coverBadge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 0l1.5 3.1L10 3.6 7.5 6l.6 3.4L5 7.8 1.9 9.4l.6-3.4L0 3.6l3.5-.5z" />
          </svg>
          Cover
        </span>
      )}
      {item instanceof File && <span className="imgUp-fileSize">{formatSize(item)}</span>}
      <div className="imgUp-overlay">
        {!isCover && (
          <button type="button" className="imgUp-action imgUp-action--cover" onClick={(e) => { e.stopPropagation(); onSetAsCover(index); }} title="Set as cover photo">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M7 0l2.1 4.3 4.9.7-3.5 3.4.8 4.8L7 10.9 2.7 13.2l.8-4.8L0 5l4.9-.7z" />
            </svg>
          </button>
        )}
        <button type="button" className="imgUp-action imgUp-action--remove" onClick={(e) => { e.stopPropagation(); onRemove(index); }} title="Remove image">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="3" x2="11" y2="11" />
            <line x1="11" y1="3" x2="3" y2="11" />
          </svg>
        </button>
      </div>
      <div className="imgUp-dragHandle" title="Drag to reorder">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.7">
          <circle cx="3" cy="2" r="1.2" />
          <circle cx="9" cy="2" r="1.2" />
          <circle cx="3" cy="6" r="1.2" />
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="3" cy="10" r="1.2" />
          <circle cx="9" cy="10" r="1.2" />
        </svg>
      </div>
    </li>
  );
}
