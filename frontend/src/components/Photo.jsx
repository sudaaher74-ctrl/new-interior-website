import React from 'react';

// Intrinsic pixel sizes of everything in /public/images. Passing these to the
// browser as width/height lets it reserve the right box before the file lands,
// which is what stops the page shifting as photos stream in.
const DIMENSIONS = {
  '/images/BelapurC2.jpeg': [1182, 665],
  '/images/BelapurC3.jpeg': [1182, 665],
  '/images/IMG_2695.JPG': [1600, 1200],
  '/images/IMG_2696.JPG': [1600, 1200],
  '/images/IMG_2697.JPG': [1600, 1200],
  '/images/IMG_2698.JPG': [1600, 1200],
  '/images/IMG_2701.JPG': [1600, 1200],
  '/images/IMG_2702.JPG': [1600, 1200],
  '/images/IMG_2705.JPG': [1600, 1200],
  '/images/IMG_2706.JPG': [1600, 1200],
  '/images/Kandivali!.jpeg': [1006, 780],
  '/images/bombayB1.jpeg': [1182, 665],
  '/images/bombayB2.jpeg': [1182, 665],
  '/images/caffe.jpeg': [1086, 724],
  '/images/caravab1.jpeg': [1086, 723],
  '/images/carvan2.jpeg': [1098, 716],
  '/images/carvan3.jpeg': [996, 788],
  '/images/juice1.jpeg': [1086, 723],
  '/images/juice2.jpeg': [978, 804],
  '/images/juice3.jpeg': [1010, 777],
};

/**
 * A cover-cropped photo that never shifts the layout.
 *
 * `ratio` sets the shape of the box (any CSS aspect-ratio value). Prefer it
 * over a fixed pixel height so the image scales down with its column on small
 * screens. `priority` marks the one image that is above the fold on a page —
 * it loads eagerly, everything else stays lazy.
 */
const Photo = ({ src, alt, ratio, className = '', priority = false, style, imgStyle }) => {
  const [w, h] = DIMENSIONS[src] || [];

  // className lands on the wrapper, not the img — the wrapper is what owns the
  // shape, so rounding it and clipping keeps the crop inside the corners.
  return (
    <div className={className} style={{ aspectRatio: ratio, width: '100%', overflow: 'hidden', ...style }}>
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }}
      />
    </div>
  );
};

export default Photo;
