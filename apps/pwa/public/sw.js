const CACHE_NAME = 'hamburger-rapid-pwa-v2';
const STATIC_ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/icon-192.svg',
  '/app/icon-512.svg'
];

// Install: pre-cache static assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🍔 [PWA ServiceWorker] Cacheando assets base');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: purge ALL legacy/old caches (such as 'nextcollege-pwa-v1')
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 [PWA ServiceWorker] Eliminando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for navigation (HTML) so users always get the latest build
// Cache-First with Network fallback for static assets (js, css, images)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 1. Navigation requests (HTML pages): Network-First
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, fallback to cached index.html
          return caches.match('/app/index.html') || caches.match('/app/');
        })
    );
    return;
  }

  // 2. Static assets & others: Stale-While-Revalidate / Cache-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
