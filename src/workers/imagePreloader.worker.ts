/**
 * Web Worker for Background Image Preloading
 * 
 * This worker runs in a separate thread to preload flipbook page images
 * without blocking the main UI thread. It receives URLs to preload and
 * posts messages back when images are ready.
 * 
 * Performance Benefits:
 * - Non-blocking: Image preloading happens in background
 * - Parallel loading: Can preload multiple images simultaneously
 * - Cache-friendly: Preloaded images are cached by browser
 */

// Type definitions for worker messages
interface PreloadRequest {
  type: 'PRELOAD';
  urls: string[];
  priority?: 'high' | 'normal' | 'low';
}

interface PreloadResponse {
  type: 'LOADED' | 'ERROR' | 'PROGRESS';
  url?: string;
  error?: string;
  loaded?: number;
  total?: number;
}

interface CancelRequest {
  type: 'CANCEL';
}

// Queue for managing preload requests
let currentPreloads = new Set<string>();
let abortControllers = new Map<string, AbortController>();

/**
 * Preload a single image using fetch API
 * This is more reliable than Image() in workers
 */
async function preloadImage(url: string): Promise<void> {
  if (currentPreloads.has(url)) {
    return; // Already loading
  }

  currentPreloads.add(url);
  const controller = new AbortController();
  abortControllers.set(url, controller);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Read the response to ensure it's cached
    await response.blob();

    // Notify main thread that image is loaded
    self.postMessage({
      type: 'LOADED',
      url,
    } as PreloadResponse);

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Preload was cancelled, don't report error
      return;
    }

    self.postMessage({
      type: 'ERROR',
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as PreloadResponse);
  } finally {
    currentPreloads.delete(url);
    abortControllers.delete(url);
  }
}

/**
 * Preload multiple images with progress updates
 */
async function preloadImages(urls: string[]): Promise<void> {
  const total = urls.length;
  let loaded = 0;

  // Send initial progress
  self.postMessage({
    type: 'PROGRESS',
    loaded: 0,
    total,
  } as PreloadResponse);

  // Preload images with limited concurrency (3 at a time for workers)
  const concurrency = 3;
  const chunks: string[][] = [];
  
  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.allSettled(
      chunk.map(async (url) => {
        try {
          await preloadImage(url);
          loaded++;
          
          // Send progress update
          self.postMessage({
            type: 'PROGRESS',
            loaded,
            total,
          } as PreloadResponse);
        } catch (err) {
          // Error already posted in preloadImage
          loaded++;
          
          self.postMessage({
            type: 'PROGRESS',
            loaded,
            total,
          } as PreloadResponse);
        }
      })
    );
  }
}

/**
 * Cancel all ongoing preload operations
 */
function cancelAll(): void {
  // Abort all ongoing fetches
  abortControllers.forEach((controller) => {
    controller.abort();
  });
  
  abortControllers.clear();
  currentPreloads.clear();
}

/**
 * Message handler
 */
self.addEventListener('message', async (event: MessageEvent) => {
  const message = event.data;

  switch (message.type) {
    case 'PRELOAD':
      {
        const request = message as PreloadRequest;
        await preloadImages(request.urls);
      }
      break;

    case 'CANCEL':
      cancelAll();
      break;

    default:
      console.warn('Unknown message type:', message.type);
  }
});

// Export empty object to make this a module
export {};
