const CACHE_NAME = 'zecure-v1';
const ASSETS = [
  '/',
  './login.html',
  './index.html',
  './premium.css',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => {
    c.addAll(ASSETS).catch(() => {});
  }));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names =>
    Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(r => {
        caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone()));
        return r;
      })
      .catch(() => caches.match(e.request) || new Response('Offline'))
  );
});

self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.notification?.title || 'Zecure', {
      body: data.notification?.body,
      icon: './icon-192.png',
      badge: './badge-72.png'
    })
  );

});
