const CACHE_NAME = 'manuel-cache-v1'; // Increment version when updating files
const urlsToCache = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/image.jpg',  // Make sure this file exists
  '/icon.png',   // Make sure this file exists
  '/'            // Ensure root directory is cached for offline use
];

/// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker and clear old caches
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
});

// Fetch assets from cache, and if not found, fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached response if found, or fetch from the network
      return cachedResponse || fetch(event.request);
    })
  );
});
