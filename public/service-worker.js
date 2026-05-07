const CACHE_NAME = 'environomics-runtime-v3';
const PRECACHE_URLS = [
  '/imgs/hero-1600.jpg',
  '/imgs/hero-2560.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((error) => {
        console.log('Image cache failed:', error);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

function isCacheableAssetRequest(request, url) {
  return (
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i.test(url.pathname)
  );
}

function updateCache(request) {
  return fetch(request).then((response) => {
    if (!response || response.status !== 200 || response.type === 'error') {
      return response;
    }

    const responseToCache = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseToCache).catch(() => {
        // Cache writes can fail on storage limits; the network response is still usable.
      });
    });

    return response;
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!isCacheableAssetRequest(request, url)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = updateCache(request).catch(() => cachedResponse || Response.error());
      return cachedResponse || networkResponse;
    })
  );
});
