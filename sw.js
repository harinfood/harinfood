// sw.js - Service Worker HARINFOOD POS Lite
// Versi cache (Ubah angka setiap update aplikasi)
const CACHE_VERSION = 'v3'; // GANTI setiap update (misal v4, v5, dst)
const CACHE_NAME = `harinfood-cache-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css?v=3',
  '/script.js?v=3',
  '/manifest.json?v=3',
  // Tambahkan semua gambar/icon/audio yang ingin di-cache:
  '/risol.webp',
  '/cibay.webp',
  '/toppoki.webp',
  '/spaghetti.webp',
  '/spaghetti1.webp',
  '/sbalungan.webp',
  '/balungan.webp',
  '/esteh.webp',
  '/esteh1.webp',
  '/2000.webp',
  '/estawar.webp',
  '/qris.webp',
  '/click.mp3',
  '/beep.mp3',
  '/ding.mp3',
  '/aaa.mp3'
];

// Install: cache semua aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama!
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first untuk file statis, network-first untuk index.html
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Jika permintaan untuk index.html, selalu ambil dari network agar update terlihat
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Simpan salinan index.html di cache (opsional, untuk offline)
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request)) // fallback offline
    );
    return;
  }

  // Untuk file lain, cache-first
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then(networkResponse => {
        // Jika file termasuk asset yang di-cache, simpan ke cache
        if (ASSETS_TO_CACHE.some(asset => url.pathname.endsWith(asset.replace('/', '')))) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback ke cache jika offline
        return caches.match(request);
      });
    })
  );
});