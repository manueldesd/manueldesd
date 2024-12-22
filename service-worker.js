const CACHE_NAME = 'manuel-cache-v2'; // Increment version when updating files
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/image.jpg',
  '/icon.png',
  '/manifest.json' // Cache the manifest as well
];

// Install service worker and cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential files...');
      return cache.addAll(FILES_TO_CACHE); // Cache all necessary files
    })
  );
});

// Activate the service worker and delete old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});

// Fetch assets from cache first, then from the network if not available
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve the cached response if available
        return cachedResponse;
      }

      // Otherwise, try fetching from the network
      return fetch(event.request).catch((error) => {
        // If network fails, you can serve a fallback page (e.g., offline.html)
        console.log('Network request failed. Serving fallback.');
        return caches.match('index.html'); // Serve the cached index page as fallback
      });
    })
  );
});
