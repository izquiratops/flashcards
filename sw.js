const CACHE_NAME = 'flashcards-v1';
const urlsToCache = [
  './',
  './index.html',
  './icon.jpg',
  './JLPT_N4.csv',
  './ドリル.csv'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});