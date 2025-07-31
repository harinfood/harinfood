const CACHE_NAME = "harinfood-pos-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  // Tambahkan asset lain seperti gambar produk, audio jika perlu
  "./risol.webp",
  "./cibay.webp",
  "./toppoki.webp",
  "./spaghetti.webp",
  "./spaghetti1.webp",
  "./sbalungan.webp",
  "./esteh.webp",
  "./esteh1.webp",
  "./2000.webp",
  "./estawar.webp",
  "./qris.webp",
  "./click.mp3",
  "./beep.mp3",
  "./ding.mp3",
  "./aaa.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});