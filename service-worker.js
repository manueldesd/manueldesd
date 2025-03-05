const CACHE_NAME = 'fruit-juice-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/fruit.html',
  '/mdsd.css',
  '/style.css',
  '/script.js',
  '/icon.png',
  '/manifest.json',
  // Add any other files you want to cache (images, fonts, etc.)
];

// Install service worker and cache assets
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
const CACHE_NAME = 'cc-site-cache-v1';

// Install the Service Worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                'cc.html',
                'cc.css',
                'cc.js',
                'manifest.json',
                'icons/icon-192x192.png',
                'icons/icon-512x512.png',
                'fj.png'
            ]);
        })
    );
});

// Activate the Service Worker and clean up old caches
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

// Fetch assets from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});