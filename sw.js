const CACHE = 'cumple-gamer-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  // No cachear llamadas a Google Sheets ni fuentes
  if (e.request.url.includes('script.google.com') ||
      e.request.url.includes('fonts.googleapis') ||
      e.request.url.includes('fonts.gstatic')) {
    e.respondWith(fetch(e.request).catch(() => new Response('')));
    return;
  }
  // Para todo lo demás: red primero, cache como fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
