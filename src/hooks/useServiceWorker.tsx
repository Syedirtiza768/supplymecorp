/**
 * Service Worker Registration Hook
 * Registers the flipbook service worker for caching optimization
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isReady: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

/**
 * Hook to manage service worker registration
 */
export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isReady: false,
    registration: null,
    error: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setStatus((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    setStatus((prev) => ({ ...prev, isSupported: true }));

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker registered:', registration.scope);

        setStatus((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        // Wait for service worker to be ready
        const ready = await navigator.serviceWorker.ready;
        console.log('[SW] Service Worker ready:', ready.scope);

        setStatus((prev) => ({
          ...prev,
          isReady: true,
        }));

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New content available, refresh to update');
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
        setStatus((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }));
      }
    };

    registerServiceWorker();
  }, []);

  /**
   * Pre-cache specific flipbook pages
   */
  const cachePages = useCallback(
    (pageUrls: string[]) => {
      if (status.isReady && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_FLIPBOOK_PAGES',
          payload: { pages: pageUrls },
        });
      }
    },
    [status.isReady]
  );

  /**
   * Clear all service worker caches
   */
  const clearCache = useCallback(() => {
    if (status.isReady && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE',
      });
    }
  }, [status.isReady]);

  /**
   * Get cache status
   */
  const getCacheStatus = useCallback(() => {
    return new Promise((resolve) => {
      if (!status.isReady || !navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_STATUS') {
          resolve(event.data.payload);
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    });
  }, [status.isReady]);

  return {
    ...status,
    cachePages,
    clearCache,
    getCacheStatus,
  };
}

/**
 * Component to register service worker at app level
 */
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useServiceWorker();
  return <>{children}</>;
}
