/**
 * Hook for True Lazy Loading of Flipbook Pages
 * 
 * Uses IntersectionObserver to detect which pages are visible/near-visible
 * and only renders those pages. Off-screen pages use lightweight placeholders.
 * 
 * Performance Benefits:
 * - Reduces initial render cost
 * - Only renders visible + buffer pages
 * - Automatically unloads far off-screen pages
 * - Improves memory usage for large flipbooks
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';

interface LazyLoadingOptions {
  /** Number of pages to load ahead/behind current page */
  bufferSize?: number;
  
  /** Total number of pages in flipbook */
  totalPages: number;
  
  /** Current page index */
  currentPage: number;
  
  /** Callback when visible pages change */
  onVisiblePagesChange?: (visiblePages: Set<number>) => void;
}

interface LazyLoadingResult {
  /** Set of page indices that should be rendered */
  visiblePages: Set<number>;
  
  /** Check if a specific page should be rendered */
  shouldRenderPage: (pageIndex: number) => boolean;
  
  /** Mark a page as loaded */
  markPageLoaded: (pageIndex: number) => void;
  
  /** Check if a page has been loaded */
  isPageLoaded: (pageIndex: number) => boolean;
  
  /** Get loading state for a page */
  getPageLoadingState: (pageIndex: number) => 'unloaded' | 'loading' | 'loaded';
  
  /** IntersectionObserver ref for page elements */
  observerRef: React.RefObject<IntersectionObserver | null>;
  
  /** Register a page element for observation */
  registerPage: (pageIndex: number, element: HTMLElement | null) => void;
}

export function useFlipbookLazyLoading(
  options: LazyLoadingOptions
): LazyLoadingResult {
  const {
    bufferSize = 2,
    totalPages,
    currentPage,
    onVisiblePagesChange,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());

  /**
   * Calculate which pages should be visible based on current page and buffer
   */
  const calculateVisiblePages = useCallback((): Set<number> => {
    const visible = new Set<number>();
    
    // Add current page
    visible.add(currentPage);
    
    // Add buffer pages before and after
    for (let i = 1; i <= bufferSize; i++) {
      // Pages before
      if (currentPage - i >= 0) {
        visible.add(currentPage - i);
      }
      
      // Pages after
      if (currentPage + i < totalPages) {
        visible.add(currentPage + i);
      }
    }
    
    return visible;
  }, [currentPage, bufferSize, totalPages]);

  /**
   * Update visible pages when current page changes
   */
  useEffect(() => {
    const newVisiblePages = calculateVisiblePages();
    setVisiblePages(newVisiblePages);
    
    if (onVisiblePagesChange) {
      onVisiblePagesChange(newVisiblePages);
    }
  }, [calculateVisiblePages, onVisiblePagesChange]);

  /**
   * Initialize IntersectionObserver
   * Detects when page elements enter/leave viewport
   */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Create observer with aggressive thresholds for flipbook context
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageElement = entry.target as HTMLElement;
          const pageIndex = parseInt(pageElement.dataset.pageIndex || '-1', 10);
          
          if (pageIndex === -1) return;

          if (entry.isIntersecting) {
            // Page is becoming visible
            setVisiblePages((prev) => new Set(prev).add(pageIndex));
          } else {
            // Page is leaving viewport
            // Keep it if it's within buffer range
            const shouldKeep = Math.abs(pageIndex - currentPage) <= bufferSize;
            
            if (!shouldKeep) {
              setVisiblePages((prev) => {
                const updated = new Set(prev);
                updated.delete(pageIndex);
                return updated;
              });
            }
          }
        });
      },
      {
        // Root is the viewport
        root: null,
        
        // Expand observation area to load slightly ahead
        rootMargin: '50% 0px',
        
        // Trigger when any part becomes visible
        threshold: 0.01,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [currentPage, bufferSize]);

  /**
   * Register a page element for observation
   */
  const registerPage = useCallback((pageIndex: number, element: HTMLElement | null) => {
    const observer = observerRef.current;
    
    if (!observer) return;

    // Unobserve old element if exists
    const oldElement = pageElementsRef.current.get(pageIndex);
    if (oldElement) {
      observer.unobserve(oldElement);
    }

    // Observe new element
    if (element) {
      element.dataset.pageIndex = String(pageIndex);
      observer.observe(element);
      pageElementsRef.current.set(pageIndex, element);
    } else {
      pageElementsRef.current.delete(pageIndex);
    }
  }, []);

  /**
   * Check if a page should be rendered
   */
  const shouldRenderPage = useCallback((pageIndex: number): boolean => {
    return visiblePages.has(pageIndex);
  }, [visiblePages]);

  /**
   * Mark a page as loaded
   */
  const markPageLoaded = useCallback((pageIndex: number) => {
    setLoadedPages((prev) => new Set(prev).add(pageIndex));
    setLoadingPages((prev) => {
      const updated = new Set(prev);
      updated.delete(pageIndex);
      return updated;
    });
  }, []);

  /**
   * Check if a page is loaded
   */
  const isPageLoaded = useCallback((pageIndex: number): boolean => {
    return loadedPages.has(pageIndex);
  }, [loadedPages]);

  /**
   * Get loading state for a page
   */
  const getPageLoadingState = useCallback((pageIndex: number): 'unloaded' | 'loading' | 'loaded' => {
    if (loadedPages.has(pageIndex)) return 'loaded';
    if (loadingPages.has(pageIndex)) return 'loading';
    return 'unloaded';
  }, [loadedPages, loadingPages]);

  /**
   * Mark pages as loading when they become visible
   */
  useEffect(() => {
    visiblePages.forEach((pageIndex) => {
      if (!loadedPages.has(pageIndex) && !loadingPages.has(pageIndex)) {
        setLoadingPages((prev) => new Set(prev).add(pageIndex));
      }
    });
  }, [visiblePages, loadedPages, loadingPages]);

  return {
    visiblePages,
    shouldRenderPage,
    markPageLoaded,
    isPageLoaded,
    getPageLoadingState,
    observerRef,
    registerPage,
  };
}
