'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * Registers the flipbook service worker for offline caching
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Workers not supported');
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('[SW] Service Worker registered successfully');
        console.log('[SW] Scope:', registration.scope);

        // Check for updates periodically (every 60 seconds)
        setInterval(() => {
          registration.update();
        }, 60000);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available
                  console.log('[SW] New content available - refresh to update');
                } else {
                  // Content is cached for offline use
                  console.log('[SW] Content cached for offline use');
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    // Wait for window load to avoid blocking page load
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  return null;
}
