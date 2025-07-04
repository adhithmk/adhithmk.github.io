// Service Worker for offline support and asset caching
const CACHE_NAME = 'adhith-mk-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/404.css',
  '/css/style.css',
  '/js/main.js',
  '/images/404-error.gif',
  'https://fonts.gstatic.com/s/arvo/v20/tDbD2oWUg0MKqScQ7Q.woff2'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          },
          // If fetch fails, return the 404 page
          () => {
            if (event.request.mode === 'navigate') {
              return caches.match('/404.html');
            }
          }
        );
      })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
