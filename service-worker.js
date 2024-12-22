const CACHE_NAME = 'manuel-cache-v2'; // Increment version when updating files
const FILES_TO_CACHE = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/image.jpg',  // Make sure this file exists
  '/icon.png',   // Make sure this file exists
  '/'            // Ensure root directory is cached for offline use
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files...');
      return cache.addAll(FILES_TO_CACHE); // Use FILES_TO_CACHE instead of urlsToCache
    })
  );
});

// Activate service worker and clear old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch assets from cache, fallback to network if not available
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
