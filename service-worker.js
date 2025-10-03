const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/styles2.css',
  '/script.js',
  '/icons/icon-152x152.png',
  '/icons/icon-167x167.png',
  '/icons/icon-180x180.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon.svg',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      const networkFetch = fetch(event.request)
        .then(async networkResponse => {
          // Clone response for cache
          const responseClone = networkResponse.clone();

          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);

          return networkResponse; // original goes to browser
        })
        .catch(() => {
          // Optional offline fallback
          // if (event.request.mode === "navigate") {
          //   return caches.match(OFFLINE_URL);
          // }
        });

      return cachedResponse || networkFetch;
    })()
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});