const CACHE_VERSION = 'v1';
const STATIC_CACHE = `sarthi-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `sarthi-dynamic-${CACHE_VERSION}`;

// App shell files to pre-cache on install
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/generated/sarthi-icon-192.dim_192x192.png',
  '/assets/generated/sarthi-icon-512.dim_512x512.png',
  '/assets/generated/sarthi-logo.dim_256x256.png',
  '/assets/generated/dashboard-hero.dim_1200x400.png',
  '/assets/generated/chatbot-avatar.dim_128x128.png',
  '/assets/generated/quiz-illustration.dim_600x400.png',
  '/assets/generated/scholarship-illustration.dim_600x400.png',
  '/assets/generated/internship-illustration.dim_600x400.png',
];

// Patterns that should NEVER be cached (ICP canister calls, auth)
const BYPASS_PATTERNS = [
  /ic0\.app/,
  /icp0\.io/,
  /raw\.ic0\.app/,
  /localhost.*canister/,
  /127\.0\.0\.1.*canister/,
  /\?canisterId=/,
  /\/api\/v2\//,
  /__webpack_hmr/,
  /sockjs-node/,
];

function shouldBypass(url) {
  return BYPASS_PATTERNS.some((pattern) => pattern.test(url));
}

function isStaticAsset(url) {
  return (
    url.includes('/assets/') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.svg') ||
    url.endsWith('.ico') ||
    url.endsWith('.woff') ||
    url.endsWith('.woff2') ||
    url.endsWith('.ttf')
  );
}

function isJsOrCss(url) {
  return (
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.includes('.js?') ||
    url.includes('.css?')
  );
}

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(
          APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))
        );
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Pre-cache failed (some assets may not exist yet):', err);
        return self.skipWaiting();
      })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith('sarthi-') &&
                name !== STATIC_CACHE &&
                name !== DYNAMIC_CACHE
            )
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Bypass ICP canister calls and other non-cacheable patterns
  if (shouldBypass(url)) return;

  // Strategy 1: Cache-first for static assets (images, fonts)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            // Return a fallback for images if offline
            return new Response('', { status: 404 });
          });
      })
    );
    return;
  }

  // Strategy 2: Cache-first for JS/CSS bundles (versioned by Vite)
  if (isJsOrCss(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Strategy 3: Network-first for HTML navigation (app shell fallback)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve cached index.html for SPA navigation
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // Default: network-first with dynamic cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
