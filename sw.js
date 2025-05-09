const cacheName = 'japanese-flashcards-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/wallpaper.jpg',
    'https://unpkg.com/98.css',
    'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js',
    '/JLPT N4.csv'
];

// Install service worker and cache the assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(urlsToCache))
    );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request).then((res) => {
                if (!res || res.status !== 200 || res.type !== 'basic') {
                    return res;
                }

                const responseToCache = res.clone();

                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return res;
            });
        })
    );
});

// Update the cache when a new version of the service worker is activated
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});