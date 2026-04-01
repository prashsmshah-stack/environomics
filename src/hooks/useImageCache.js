import { useEffect, useMemo } from 'react';

const retainedImages = new Map();

/**
 * Hook to ensure images are cached in the browser
 * Prevents images from reloading when scrolling in and out of view
 */
export function useImageCache(imageSources = []) {
  const sources = useMemo(
    () =>
      (imageSources ?? []).filter(
        (src) => typeof src === 'string' && src.length > 0 && !src.startsWith('data:')
      ),
    [imageSources]
  );

  useEffect(() => {
    if (sources.length === 0) return;

    sources.forEach((src, index) => {
      if (retainedImages.has(src)) {
        return;
      }

      const img = new Image();
      img.decoding = index === 0 ? 'sync' : 'async';
      img.fetchPriority = index === 0 ? 'high' : 'auto';
      img.src = src;

      if (typeof img.decode === 'function') {
        img.decode().catch(() => {
          // Some browsers reject decode() when the image is already complete.
        });
      }

      retainedImages.set(src, img);
    });
  }, [sources]);
}

/**
 * Cache critical images on page load
 */
export function cacheCriticalImages(imageSources = []) {
  if (typeof window === 'undefined') return;

  imageSources.forEach((src) => {
    if (!src || src.startsWith('data:')) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}
