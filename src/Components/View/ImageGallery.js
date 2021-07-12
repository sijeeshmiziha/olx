import React, { useState } from 'react';
import './ImageGallery.css';

function ImageGallery({ images }) {
  const list = Array.isArray(images) && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const displayList = list.length ? list : [];

  if (displayList.length === 0) return null;

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? displayList.length - 1 : i - 1));
  };
  const goNext = () => {
    setActiveIndex((i) => (i === displayList.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="imageGallery">
      <div className="imageGalleryMain">
        {displayList.length > 1 && (
          <button
            type="button"
            className="imageGalleryArrow imageGalleryArrowLeft"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}
        <img src={displayList[activeIndex]} alt="" />
        {displayList.length > 1 && (
          <button
            type="button"
            className="imageGalleryArrow imageGalleryArrowRight"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>
      {displayList.length > 1 && (
        <div className="imageGalleryThumbs">
          {displayList.map((src, i) => (
            <button
              type="button"
              key={i}
              className={`imageGalleryThumb ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
