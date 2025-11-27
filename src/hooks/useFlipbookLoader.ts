"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export type LoadingState = 
  | 'IDLE'
  | 'FETCHING_DATA'
  | 'PRELOADING_IMAGES'
  | 'INITIALIZING_ENGINE'
  | 'READY'
  | 'ERROR';

interface UseFlipbookLoaderOptions {
  /**
   * Number of pages to preload ahead of current page
   * Set to -1 to preload all pages
   */
  preloadCount?: number;
  
  /**
   * Enable parallel image loading
   */
  parallelLoading?: boolean;
  
  /**
   * Maximum concurrent image loads
   */
  maxConcurrent?: number;
  
  /**
   * Callback when state changes
   */
  onStateChange?: (state: LoadingState) => void;
}

interface UseFlipbookLoaderResult {
  state: LoadingState;
  progress: number;
  status: string;
  error: string | null;
  
  // Control methods
  setFetchingData: () => void;
  setPreloadingImages: () => void;
  setInitializingEngine: () => void;
  setReady: () => void;
  setError: (error: string) => void;
  
  // Image preloading
  preloadImages: (imageUrls: string[]) => Promise<void>;
  updateProgress: (loaded: number, total: number) => void;
}

export const useFlipbookLoader = (
  options: UseFlipbookLoaderOptions = {}
): UseFlipbookLoaderResult => {
  const {
    preloadCount = -1,
    parallelLoading = true,
    maxConcurrent = 5,
    onStateChange
  } = options;

  const [state, setState] = useState<LoadingState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [error, setErrorState] = useState<string | null>(null);
  
  const loadedCountRef = useRef(0);
  const totalCountRef = useRef(0);

  // State change handler
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  // Update status text based on state
  useEffect(() => {
    switch (state) {
      case 'IDLE':
        setStatus('Initializing...');
        setProgress(0);
        break;
      case 'FETCHING_DATA':
        setStatus('Loading catalog data...');
        setProgress(10);
        break;
      case 'PRELOADING_IMAGES':
        setStatus('Loading images...');
        break;
      case 'INITIALIZING_ENGINE':
        setStatus('Preparing flipbook...');
        setProgress(95);
        break;
      case 'READY':
        setStatus('Ready!');
        setProgress(100);
        break;
      case 'ERROR':
        setStatus('Error loading catalog');
        break;
    }
  }, [state]);

  const setFetchingData = useCallback(() => {
    setState('FETCHING_DATA');
    setErrorState(null);
  }, []);

  const setPreloadingImages = useCallback(() => {
    setState('PRELOADING_IMAGES');
  }, []);

  const setInitializingEngine = useCallback(() => {
    setState('INITIALIZING_ENGINE');
  }, []);

  const setReady = useCallback(() => {
    setState('READY');
  }, []);

  const setError = useCallback((errorMsg: string) => {
    setState('ERROR');
    setErrorState(errorMsg);
  }, []);

  const updateProgress = useCallback((loaded: number, total: number) => {
    loadedCountRef.current = loaded;
    totalCountRef.current = total;
    
    if (total > 0) {
      // Map image loading to 10% -> 90% range
      const imageProgress = (loaded / total) * 80;
      setProgress(10 + imageProgress);
    }
  }, []);

  /**
   * Preload a single image with promise
   */
  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      img.src = url;
    });
  }, []);

  /**
   * Preload images with configurable concurrency
   */
  const preloadImages = useCallback(async (imageUrls: string[]): Promise<void> => {
    if (!imageUrls || imageUrls.length === 0) {
      updateProgress(0, 0);
      return;
    }

    const total = imageUrls.length;
    let loaded = 0;
    
    totalCountRef.current = total;
    loadedCountRef.current = 0;

    if (parallelLoading) {
      // Parallel loading with concurrency limit
      const chunks: string[][] = [];
      for (let i = 0; i < imageUrls.length; i += maxConcurrent) {
        chunks.push(imageUrls.slice(i, i + maxConcurrent));
      }

      for (const chunk of chunks) {
        try {
          await Promise.all(
            chunk.map(async (url) => {
              await preloadImage(url);
              loaded++;
              updateProgress(loaded, total);
            })
          );
        } catch (err) {
          console.error('Error preloading image chunk:', err);
          // Continue loading other images
        }
      }
    } else {
      // Sequential loading
      for (const url of imageUrls) {
        try {
          await preloadImage(url);
          loaded++;
          updateProgress(loaded, total);
        } catch (err) {
          console.error('Error preloading image:', url, err);
          // Continue loading other images
        }
      }
    }
  }, [parallelLoading, maxConcurrent, preloadImage, updateProgress]);

  return {
    state,
    progress,
    status,
    error,
    setFetchingData,
    setPreloadingImages,
    setInitializingEngine,
    setReady,
    setError,
    preloadImages,
    updateProgress
  };
};

export default useFlipbookLoader;
