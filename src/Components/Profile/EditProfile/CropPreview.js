import React, { useRef, useEffect } from 'react';

export default function CropPreview({ src, crop, zoom, onCropChange, onZoomChange }) {
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const imgStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(calc(-50% + ${crop.x}%), calc(-50% + ${crop.y}%)) scale(${zoom})`,
    maxWidth: 'none',
    maxHeight: 'none',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
    userSelect: 'none',
  };

  const getPointerPos = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const handleDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    lastPos.current = getPointerPos(e);
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const pos = getPointerPos(e);
    const dx = pos.x - lastPos.current.x;
    const dy = pos.y - lastPos.current.y;
    lastPos.current = pos;
    const rect = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : { width: 340, height: 340 };
    const sensitivity = 100 / rect.width;
    onCropChange((prev) => ({
      x: Math.max(-50, Math.min(50, prev.x + dx * sensitivity)),
      y: Math.max(-50, Math.min(50, prev.y + dy * sensitivity)),
    }));
  };

  const handleUp = () => { dragging.current = false; };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    onZoomChange((prev) => Math.max(1, Math.min(3, prev + delta)));
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  });

  return (
    <div
      ref={containerRef}
      className="epCropPreview"
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onWheel={handleWheel}
    >
      <img src={src} alt="" style={imgStyle} draggable={false} />
      <div className="epCropOverlay">
        <div className="epCropCircle" />
      </div>
    </div>
  );
}
