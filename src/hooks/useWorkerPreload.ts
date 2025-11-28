/**
 * Hook for Worker-Based Image Preloading
 * 
 * Manages a Web Worker that preloads images in the background.
 * Integrates with the image cache to store preloaded images.
 * 
 * Performance Benefits:
 * - Non-blocking image preloading
 * - Automatic preloading of upcoming pages
 * - Integrated caching
 * - Efficient resource management
 */

"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { getImageCache } from '@/lib/imageCache';

interface UseWorkerPreloadOptions {
  /** Number of pages to preload ahead */
  preloadAhead?: number;
  
  /** Number of pages to preload behind */
  preloadBehind?: number;
  
  /** Enable/disable worker preloading */
  enabled?: boolean;
  
  /** Callback when preload progress updates */
  onProgress?: (loaded: number, total: number) => void;
  
  /** Callback when image is loaded */
  onImageLoaded?: (url: string) => void;
  
  /** Callback when error occurs */
  onError?: (url: string, error: string) => void;
}

interface UseWorkerPreloadResult {
  /** Trigger preload for specific page indices */
  preloadPages: (pageIndices: number[], pageUrls: string[]) => void;
  
  /** Cancel all ongoing preloads */
  cancelPreload: () => void;
  
  /** Check if worker is available */
  isWorkerAvailable: boolean;
  
  /** Current preload progress */
  progress: { loaded: number; total: number };
}

export function useWorkerPreload(
  options: UseWorkerPreloadOptions = {}
): UseWorkerPreloadResult {
  const {
    enabled = true,
    onProgress,
    onImageLoaded,
    onError,
  } = options;

  const workerRef = useRef<Worker | null>(null);
  const [isWorkerAvailable, setIsWorkerAvailable] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const imageCache = getImageCache();

  /**
   * Initialize Web Worker
   */
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof Worker === 'undefined') {
      setIsWorkerAvailable(false);
      return;
    }

    try {
      // Create worker from inline code to avoid build issues
      // In production, you might want to use a separate worker file
      const workerCode = `
        let currentPreloads = new Set();
        let abortControllers = new Map();

        async function preloadImage(url) {
          if (currentPreloads.has(url)) return;
          
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
              throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }

            await response.blob();

            self.postMessage({
              type: 'LOADED',
              url,
            });

          } catch (error) {
            if (error.name === 'AbortError') return;

            self.postMessage({
              type: 'ERROR',
              url,
              error: error.message || 'Unknown error',
            });
          } finally {
            currentPreloads.delete(url);
            abortControllers.delete(url);
          }
        }

        async function preloadImages(urls) {
          const total = urls.length;
          let loaded = 0;

          self.postMessage({
            type: 'PROGRESS',
            loaded: 0,
            total,
          });

          const concurrency = 3;
          const chunks = [];
          
          for (let i = 0; i < urls.length; i += concurrency) {
            chunks.push(urls.slice(i, i + concurrency));
          }

          for (const chunk of chunks) {
            await Promise.allSettled(
              chunk.map(async (url) => {
                try {
                  await preloadImage(url);
                  loaded++;
                  
                  self.postMessage({
                    type: 'PROGRESS',
                    loaded,
                    total,
                  });
                } catch (err) {
                  loaded++;
                  
                  self.postMessage({
                    type: 'PROGRESS',
                    loaded,
                    total,
                  });
                }
              })
            );
          }
        }

        function cancelAll() {
          abortControllers.forEach((controller) => {
            controller.abort();
          });
          
          abortControllers.clear();
          currentPreloads.clear();
        }

        self.addEventListener('message', async (event) => {
          const message = event.data;

          switch (message.type) {
            case 'PRELOAD':
              await preloadImages(message.urls);
              break;

            case 'CANCEL':
              cancelAll();
              break;
          }
        });
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      
      workerRef.current = new Worker(workerUrl);
      setIsWorkerAvailable(true);

      // Handle worker messages
      workerRef.current.onmessage = (event) => {
        const message = event.data;

        switch (message.type) {
          case 'LOADED':
            if (onImageLoaded) {
              onImageLoaded(message.url);
            }
            // Image is now cached by browser
            break;

          case 'ERROR':
            if (onError) {
              onError(message.url, message.error);
            }
            break;

          case 'PROGRESS':
            setProgress({
              loaded: message.loaded,
              total: message.total,
            });
            if (onProgress) {
              onProgress(message.loaded, message.total);
            }
            break;
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setIsWorkerAvailable(false);
      };

      // Cleanup
      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
        URL.revokeObjectURL(workerUrl);
        setIsWorkerAvailable(false);
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
      setIsWorkerAvailable(false);
    }
  }, [enabled, onImageLoaded, onError, onProgress]);

  /**
   * Preload specific pages
   */
  const preloadPages = useCallback((pageIndices: number[], pageUrls: string[]) => {
    if (!workerRef.current || !isWorkerAvailable) {
      // Fallback: preload using main thread
      pageUrls.forEach(url => {
        if (!imageCache.has(url)) {
          imageCache.preload(url).catch(err => {
            if (onError) {
              onError(url, err.message);
            }
          });
        }
      });
      return;
    }

    // Filter out already cached URLs
    const urlsToPreload = pageUrls.filter(url => !imageCache.has(url));

    if (urlsToPreload.length === 0) {
      return; // All images already cached
    }

    // Send to worker
    workerRef.current.postMessage({
      type: 'PRELOAD',
      urls: urlsToPreload,
    });
  }, [isWorkerAvailable, imageCache, onError]);

  /**
   * Cancel all ongoing preloads
   */
  const cancelPreload = useCallback(() => {
    if (workerRef.current && isWorkerAvailable) {
      workerRef.current.postMessage({
        type: 'CANCEL',
      });
    }
  }, [isWorkerAvailable]);

  return {
    preloadPages,
    cancelPreload,
    isWorkerAvailable,
    progress,
  };
}
