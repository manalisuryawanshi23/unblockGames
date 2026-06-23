const CACHE_VERSION = 'ugz-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/robots.txt',
];

// JSON data files — stale-while-revalidate (fast load + background refresh)
const DATA_PATTERNS = [
  /\/data\/categories\.json/,
  /\/data\/games-trending\.json/,
  /\/data\/games-initial\.json/,
  /\/data\/games-featured\.json/,
  /\/data\/slug-map\.json/,
  /\/data\/detail-index\.json/,
];

// Image CDN patterns — cache-first with long TTL
const IMAGE_PATTERNS = [
  /images\.weserv\.nl/,
  /img\.gamemonetize/,
  /html5\.gamemonetize/,
];

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate — Clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch — Strategy routing ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Skip AdSense and analytics (never cache ad calls)
  if (url.hostname.includes('googlesyndication') ||
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('doubleclick')) return;

  // JSON data files → Stale-While-Revalidate
  if (DATA_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(DATA_CACHE, request));
    return;
  }

  // Game thumbnails & CDN images → Cache-first (30 day TTL)
  if (IMAGE_PATTERNS.some((p) => p.test(url.href))) {
    event.respondWith(cacheFirstWithExpiry(IMAGE_CACHE, request, 30 * 24 * 60 * 60));
    return;
  }

  // Navigation requests (HTML pages) → Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets (JS/CSS bundles) → Cache-first
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(STATIC_CACHE, request));
    return;
  }

  // Default → Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ─── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(cacheName, request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

async function cacheFirstWithExpiry(cacheName, request, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
      if (age < maxAgeSeconds) return cached;
    } else {
      return cached; // No date header, use it anyway
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cached || new Response('', { status: 503 });
  }
}
