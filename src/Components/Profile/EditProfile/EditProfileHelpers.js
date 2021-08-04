import { MS_PER_DAY } from '../../../constants';

/** Days since a Firestore timestamp (or ms). */
export function daysSinceTimestamp(ts) {
  if (!ts) return Infinity;
  const ms = ts.seconds ? ts.seconds * 1000 : ts;
  return Math.floor((Date.now() - ms) / MS_PER_DAY);
}

/** Load an image from a data URL. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Given a source image data URL, crop offset {x,y} (%), and zoom,
 * produce a square-cropped JPEG blob at outputSize px.
 */
export async function getCroppedImg(imageSrc, cropOffset, zoomLevel, outputSize) {
  const img = await loadImage(imageSrc);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const base = Math.min(iw, ih);
  const regionSize = base / zoomLevel;
  const cx = iw / 2 - (cropOffset.x / 100) * iw;
  const cy = ih / 2 - (cropOffset.y / 100) * ih;
  const sx = Math.max(0, Math.min(cx - regionSize / 2, iw - regionSize));
  const sy = Math.max(0, Math.min(cy - regionSize / 2, ih - regionSize));
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, regionSize, regionSize, 0, 0, outputSize, outputSize);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
  });
}
