const CACHE_NAME = "kedai-tutup-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/libur.webp",
  "/harinfood.webp",
  "/libur.mp3",
  "/aduh.mp3"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
  self.clients.matchAll().then(clients => {
    clients.forEach(c => c.postMessage({ type: "UPDATE_READY" }));
  });
});

self.addEventListener("fetch", event => {
  if (event.request.destination === "audio") {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
