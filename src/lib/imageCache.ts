/**
 * In-Memory Image Cache with LRU Eviction
 * 
 * Provides a cache for preloaded images to prevent re-downloading.
 * Uses LRU (Least Recently Used) eviction strategy to manage memory.
 * 
 * Performance Benefits:
 * - Prevents duplicate network requests
 * - Fast access to frequently used images
 * - Automatic memory management with size limits
 */

interface CacheEntry {
  url: string;
  image: HTMLImageElement;
  timestamp: number;
  size: number; // Approximate size in bytes
}

class ImageCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number; // Maximum cache size in bytes
  private currentSize: number;
  private maxEntries: number; // Maximum number of entries

  constructor(maxSizeMB: number = 50, maxEntries: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    this.currentSize = 0;
    this.maxEntries = maxEntries;
  }

  /**
   * Get an image from cache
   * Updates timestamp for LRU tracking
   */
  get(url: string): HTMLImageElement | null {
    const entry = this.cache.get(url);
    
    if (entry) {
      // Update timestamp for LRU
      entry.timestamp = Date.now();
      return entry.image;
    }
    
    return null;
  }

  /**
   * Check if URL is in cache
   */
  has(url: string): boolean {
    return this.cache.has(url);
  }

  /**
   * Add an image to cache
   * Automatically evicts old entries if needed
   */
  set(url: string, image: HTMLImageElement): void {
    // Estimate image size (rough approximation)
    const estimatedSize = this.estimateImageSize(image);

    // If this single image exceeds max size, don't cache it
    if (estimatedSize > this.maxSize) {
      console.warn(`Image too large to cache: ${url}`);
      return;
    }

    // Remove existing entry if updating
    if (this.cache.has(url)) {
      this.delete(url);
    }

    // Evict entries if needed
    while (
      this.currentSize + estimatedSize > this.maxSize ||
      this.cache.size >= this.maxEntries
    ) {
      this.evictLRU();
    }

    // Add to cache
    const entry: CacheEntry = {
      url,
      image,
      timestamp: Date.now(),
      size: estimatedSize,
    };

    this.cache.set(url, entry);
    this.currentSize += estimatedSize;
  }

  /**
   * Delete a specific entry from cache
   */
  delete(url: string): boolean {
    const entry = this.cache.get(url);
    
    if (entry) {
      this.cache.delete(url);
      this.currentSize -= entry.size;
      return true;
    }
    
    return false;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    entries: number;
    sizeMB: number;
    maxSizeMB: number;
    hitRate?: number;
  } {
    return {
      entries: this.cache.size,
      sizeMB: this.currentSize / (1024 * 1024),
      maxSizeMB: this.maxSize / (1024 * 1024),
    };
  }

  /**
   * Preload an image and add to cache
   */
  async preload(url: string): Promise<HTMLImageElement> {
    // Check if already cached
    const cached = this.get(url);
    if (cached) {
      return cached;
    }

    // Load the image
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.set(url, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // Set crossOrigin to allow canvas manipulation if needed
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  /**
   * Preload multiple images
   */
  async preloadBatch(urls: string[]): Promise<void> {
    const promises = urls.map((url) => 
      this.preload(url).catch((err) => {
        console.error(`Failed to preload ${url}:`, err);
      })
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestUrl: string | null = null;
    let oldestTimestamp = Infinity;

    // Find least recently used entry
    for (const [url, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestUrl = url;
      }
    }

    // Remove oldest entry
    if (oldestUrl) {
      this.delete(oldestUrl);
    }
  }

  /**
   * Estimate image size in bytes
   * This is a rough approximation based on dimensions
   */
  private estimateImageSize(image: HTMLImageElement): number {
    // Estimate: width × height × 4 bytes per pixel (RGBA)
    // Add some overhead for browser internals
    const pixelCount = image.naturalWidth * image.naturalHeight;
    const bytesPerPixel = 4;
    const overhead = 1.2; // 20% overhead
    
    return Math.round(pixelCount * bytesPerPixel * overhead);
  }
}

// Singleton instance
let imageCacheInstance: ImageCache | null = null;

/**
 * Get or create the global image cache instance
 */
export function getImageCache(): ImageCache {
  if (!imageCacheInstance) {
    imageCacheInstance = new ImageCache(50, 100); // 50MB, 100 images max
  }
  return imageCacheInstance;
}

/**
 * Reset the cache instance (useful for testing)
 */
export function resetImageCache(): void {
  if (imageCacheInstance) {
    imageCacheInstance.clear();
  }
  imageCacheInstance = null;
}

export { ImageCache };
