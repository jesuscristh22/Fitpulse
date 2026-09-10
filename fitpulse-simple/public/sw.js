const CACHE_NAME = "fitpulse-static-v1";
const STATIC_ASSETS = ["/icons/icon-192.png", "/icons/icon-512.png", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

// Cache-first ONLY for same-origin static images/icons. Everything else
// (pages, API routes, auth-dependent data) always goes straight to the
// network — FitPulse is a highly personalized, dynamic app, so aggressively
// caching pages could risk showing stale data or, worse, one person's
// cached data to someone else on a shared device. This keeps things safe
// while still making the app installable and repeat asset loads faster.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isStaticAsset =
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/icons/") || url.pathname.startsWith("/images/"));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          }),
      ),
    );
  }
});
