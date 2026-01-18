/**
 * Flipbook Service Worker
 * Optimizes repeat visits by caching flipbook pages and API responses
 * 
 * Caching Strategy:
 * - Flipbook images: Cache-first with network fallback
 * - API responses: Network-first with cache fallback (stale-while-revalidate)
 * - Static assets: Cache-first
 */

const CACHE_VERSION = 'flipbook-v2-yellow-borders';
const FLIPBOOK_CACHE = `${CACHE_VERSION}-flipbook`;
const API_CACHE = `${CACHE_VERSION}-api`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

// Dynamic pre-cache is driven by messages from the app.
// Remove hardcoded flipbook IDs; allow app to instruct which pages to cache.

// API URL pattern
const API_URL_PATTERN = /\/api\//;
const FLIPBOOK_IMAGE_PATTERN = /\/uploads\/flipbooks\//;

/**
 * Install event - pre-cache critical resources
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(self.skipWaiting());
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    (async () => {
      // Delete old cache versions
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('flipbook-') && !name.startsWith(CACHE_VERSION))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
      
      // Take control of all clients immediately
      await self.clients.claim();
      console.log('[SW] Service Worker activated');
    })()
  );
});

/**
 * Fetch event - handle caching strategies
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Strategy: Cache-first for flipbook images
  if (FLIPBOOK_IMAGE_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirstWithNetworkFallback(event.request, FLIPBOOK_CACHE));
    return;
  }
  
  // Strategy: Stale-while-revalidate for API responses
  if (API_URL_PATTERN.test(url.pathname)) {
    event.respondWith(
      staleWhileRevalidate(event.request, API_CACHE).catch(err => {
        console.warn('[SW] Network error:', err.message);
        return new Response(null, { status: 503, statusText: 'Service Unavailable' });
      })
    );
    return;
  }
});

/**
 * Cache-first strategy with network fallback
 * Best for: Static assets, flipbook images
 */
async function cacheFirstWithNetworkFallback(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }
  
  // Fall back to network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      // Clone response before caching (response can only be consumed once)
      cache.put(request, networkResponse.clone());
      console.log('[SW] Cached from network:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network error:', request.url, error.message);
    
    // Return offline placeholder if available
    return new Response('Image not available offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Stale-while-revalidate strategy
 * Best for: API responses that can be slightly stale
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Try cache first (stale)
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh response in background (revalidate)
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        // Update cache with fresh response
        cache.put(request, networkResponse.clone());
        console.log('[SW] Revalidated:', request.url);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.warn('[SW] Revalidation failed:', request.url, error.message);
      return cachedResponse; // Return stale if network fails
    });
  
  // Return cached response immediately, or wait for network
  if (cachedResponse) {
    console.log('[SW] Serving stale:', request.url);
    return cachedResponse;
  }
  
  // No cache, wait for network (will throw if network fails, caught by caller)
  return fetchPromise;
}

/**
 * Message handler for cache management
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'CACHE_FLIPBOOK_PAGES':
      // Pre-cache specific pages
      cacheFlipbookPages(payload.pages);
      break;
    case 'PRECACHE_FIRST_PAGES':
      // Pre-cache first N pages for a flipbook by calling API
      // payload: { apiUrl, flipbookId, count }
      preCacheFirstPages({ ...payload, count: 3 }).catch((e) => console.warn('[SW] PRECACHE_FIRST_PAGES failed:', e?.message || e));
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.source.postMessage({ type: 'CACHE_STATUS', payload: status });
      });
      break;
  }
});

/**
 * Cache specific flipbook pages (called from main thread)
 */
async function cacheFlipbookPages(pageUrls) {
  const cache = await caches.open(FLIPBOOK_CACHE);
  
  await Promise.allSettled(
    pageUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('[SW] Dynamically cached:', url);
        }
      } catch (error) {
        console.warn('[SW] Failed to cache:', url);
      }
    })
  );
}

/**
 * Fetch pages from API and pre-cache the first N image URLs
 */
async function preCacheFirstPages({ apiUrl, flipbookId, count = 10 }) {
  if (!apiUrl || !flipbookId) return;
  const cache = await caches.open(FLIPBOOK_CACHE);
  const pagesEndpoint = `${apiUrl}/api/flipbooks/${flipbookId}/pages`;
  
  try {
    const res = await fetch(pagesEndpoint, { mode: 'cors' });
    if (!res.ok) return;
    const pages = await res.json();
    const sorted = (pages || []).sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));
    const first = sorted.slice(0, count);
    
    // Fix: Only prepend apiUrl if URL doesn't already start with http
    const resolveUrl = (u) => {
      if (!u) return null;
      if (typeof u === 'string' && u.startsWith('http')) return u;
      // Remove leading slash if present to avoid double slashes
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${apiUrl}${path}`;
    };
    const urls = first.map(p => resolveUrl(p.imageUrl)).filter(Boolean);
    
    await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response);
            console.log('[SW] Pre-cached:', url);
          }
        } catch (error) {
          console.warn('[SW] Failed to pre-cache:', url, error?.message || error);
        }
      })
    );
  } catch (e) {
    console.warn('[SW] Pre-cache pages error:', e?.message || e);
  }
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

/**
 * Get cache status
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }
  
  return status;
}
