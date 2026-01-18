/**
 * Lightweight API caching layer for instant responses
 * Provides in-memory caching with TTL for frontend API calls
 */

// Cache storage
const cache = new Map();
const pendingRequests = new Map(); // Deduplicate concurrent requests

// Default TTL values (in milliseconds)
const DEFAULT_TTL = 30 * 1000; // 30 seconds
const CACHE_CONFIG = {
  // Products - cache longer as they change less frequently
  '/api/products': 60 * 1000, // 1 minute
  '/api/products/new': 60 * 1000,
  '/api/products/featured': 60 * 1000,
  '/api/products/most-viewed': 60 * 1000,
  '/api/products/filters/categories': 5 * 60 * 1000, // 5 minutes
  '/api/products/filters/brands': 5 * 60 * 1000,
  
  // Cart/Wishlist - shorter TTL for freshness
  '/api/cart': 10 * 1000, // 10 seconds
  '/api/wishlist': 10 * 1000,
  '/api/wishlist/count': 10 * 1000,
  
  // Flipbook - cache longer
  '/api/flipbooks': 2 * 60 * 1000, // 2 minutes
  '/api/flipbooks/featured/current': 2 * 60 * 1000,
  
  // Customers - cache for login performance
  '/api/customers': 5 * 60 * 1000, // 5 minutes
  
  // Reviews - moderate caching
  '/api/reviews': 30 * 1000,
};

/**
 * Get TTL for a given endpoint
 */
function getTTL(endpoint) {
  // Check for exact match first
  if (CACHE_CONFIG[endpoint]) {
    return CACHE_CONFIG[endpoint];
  }
  
  // Check for prefix match
  for (const [prefix, ttl] of Object.entries(CACHE_CONFIG)) {
    if (endpoint.startsWith(prefix)) {
      return ttl;
    }
  }
  
  return DEFAULT_TTL;
}

/**
 * Generate cache key from URL and headers
 */
function getCacheKey(url, options = {}) {
  const sessionId = options.headers?.['x-session-id'] || '';
  return `${url}|${sessionId}`;
}

/**
 * Check if cache entry is valid
 */
function isValid(entry) {
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Cached fetch with request deduplication
 * 
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {Object} cacheOptions - Cache options
 * @param {boolean} cacheOptions.skip - Skip cache for this request
 * @param {number} cacheOptions.ttl - Custom TTL in milliseconds
 * @returns {Promise<any>} - The response data
 */
export async function cachedFetch(url, options = {}, cacheOptions = {}) {
  const { skip = false, ttl: customTTL } = cacheOptions;
  
  // Only cache GET requests
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET' || skip) {
    return rawFetch(url, options);
  }
  
  const cacheKey = getCacheKey(url, options);
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (isValid(cached)) {
    console.log(`⚡ Cache HIT: ${url.split('?')[0]}`);
    return cached.data;
  }
  
  // Check if there's already a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Request dedup: ${url.split('?')[0]}`);
    return pendingRequests.get(cacheKey);
  }
  
  // Make the request
  const requestPromise = (async () => {
    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);
      
      // Determine TTL
      const endpoint = new URL(url, window.location.origin).pathname;
      const ttl = customTTL || getTTL(endpoint);
      
      // Cache the result
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      });
      
      console.log(`📡 Fetched: ${endpoint} (${duration}ms, cached ${ttl/1000}s)`);
      
      return data;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();
  
  // Store as pending request for deduplication
  pendingRequests.set(cacheKey, requestPromise);
  
  return requestPromise;
}

/**
 * Raw fetch without caching (for mutations)
 */
async function rawFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Invalidate cache for a specific URL pattern
 */
export function invalidateCache(pattern) {
  if (!pattern) {
    cache.clear();
    console.log('🗑️ Cache cleared completely');
    return;
  }
  
  let invalidated = 0;
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      invalidated++;
    }
  }
  
  if (invalidated > 0) {
    console.log(`🗑️ Invalidated ${invalidated} cache entries matching: ${pattern}`);
  }
}

/**
 * Prefetch URLs into cache
 */
export async function prefetch(urls) {
  const promises = urls.map(url => 
    cachedFetch(url).catch(e => console.warn(`Prefetch failed: ${url}`, e))
  );
  await Promise.all(promises);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  let valid = 0;
  let expired = 0;
  
  for (const entry of cache.values()) {
    if (isValid(entry)) {
      valid++;
    } else {
      expired++;
    }
  }
  
  return {
    total: cache.size,
    valid,
    expired,
    pending: pendingRequests.size,
  };
}

/**
 * Mutation helper - performs action and invalidates related cache
 */
export async function mutate(url, options, invalidatePatterns = []) {
  const result = await rawFetch(url, options);
  
  // Invalidate related cache entries
  for (const pattern of invalidatePatterns) {
    invalidateCache(pattern);
  }
  
  return result;
}

export default {
  fetch: cachedFetch,
  invalidate: invalidateCache,
  prefetch,
  mutate,
  getStats: getCacheStats,
};
