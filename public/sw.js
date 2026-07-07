/*
  Minimal service worker — caches the app shell so the UI loads on a flaky or
  absent connection (common on Rwandan mobile networks). API calls are never
  cached; they always go to the network so health info stays fresh, and the app
  shows its calm offline banner when the backend is unreachable.
*/
// Bump this version on every deploy that must invalidate the cached app shell.
// The activate handler deletes any cache whose name != CACHE, so bumping the
// suffix purges the previous shell (fixes users stuck on a stale build).
const CACHE = 'srh-shell-v2'
const SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only handle GET navigations/assets. Never cache API or non-GET requests.
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.pathname.startsWith('/api/')) return

  // App navigations: network-first, fall back to cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    )
    return
  }

  // Static assets: cache-first, then network (and cache the result).
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
          return res
        }),
    ),
  )
})
