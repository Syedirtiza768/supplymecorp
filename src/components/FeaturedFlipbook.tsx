"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EnhancedFlipBook } from "@/components/flipbook/EnhancedFlipBook";
import { FlipbookLoader } from "@/components/flipbook/FlipbookLoader";
import { FlipbookErrorFallback } from "@/components/flipbook/FlipbookErrorFallback";
import { useFlipbookLoader } from "@/hooks/useFlipbookLoader";
import type { FlipbookPage, TOCEntry } from "@/types/flipbook-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// Helper to resolve relative image URLs against backend origin
const resolveImageUrl = (u: string, apiUrl: string): string => {
  if (!u) return u;
  return u.startsWith('http') ? u : `${apiUrl}${u}`;
};
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

/**
 * Cache upcoming pages in Service Worker for smooth navigation
 */
function cacheUpcomingPages(currentPage: number, pages: any[], apiUrl: string) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (!navigator.serviceWorker.controller) return;
  
  // Cache next 2 pages ahead of current position
  const pagesToCache = pages
    .slice(currentPage, currentPage + 2)
    .map(p => {
      // Fix: Only prepend apiUrl if imageUrl doesn't already start with http
      const url = p.imageUrl;
      if (url?.startsWith('http')) return url;
      const path = url?.startsWith('/') ? url : `/${url}`;
      return `${apiUrl}${path}`;
    })
    .filter(url => url?.startsWith('http'));
  
  if (pagesToCache.length > 0) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_FLIPBOOK_PAGES',
      payload: { pages: pagesToCache },
    });
  }
}

export function FeaturedFlipbook() {
  const searchParams = useSearchParams();
  const [flipbook, setFlipbook] = useState<any>(null);
  const [isFlipbookMounted, setIsFlipbookMounted] = useState(false);
  
  // Get initial page from URL (1-based to 0-based conversion)
  const initialPage = useMemo(() => {
    const pageParam = searchParams?.get('page');
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        return pageNum - 1; // Convert to 0-based
      }
    }
    return 0;
  }, [searchParams]);
  
  // Calculate responsive flipbook dimensions based on available viewport
  const flipbookDimensions = useMemo(() => {
    if (typeof window === 'undefined') {
      return { width: 380, height: 500 }; // Default for SSR
    }
    
    // Available height calculation:
    // viewport - navbar (120px) - section padding (48px) - title (~100px) - safety margin (50px)
    // We assume the user scrolls to the section, so we don't subtract heroHeight
    const navbarHeight = 120;
    const sectionPadding = 48;
    const titleHeight = 100;
    const safetyMargin = 50;
    const availableHeight = window.innerHeight - navbarHeight - sectionPadding - titleHeight - safetyMargin;
    
    // Book aspect ratio (3:4 for single page)
    const aspectRatio = 0.75; // width/height for single page
    
    // Start with available height but cap at reasonable max (scaled 90% for safety buffer)
    let height = Math.min(availableHeight * 0.9, 800);
    let width = height * aspectRatio;
    
    // Ensure minimum dimensions for usability
    if (height < 400) height = 400;
    if (width < 300) width = 300;
    
    // Ensure it fits viewport width (account for spread = 2x width + padding + controls)
    const maxWidth = (window.innerWidth - 200) / 2; // Spread view needs 2x + controls
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  }, []);
  
  /**
   * Lazy Loading Configuration:
   * - Preload first 5 pages only for fast initial load
   * - Remaining pages load on-demand as user flips
   * - preloadPages=3 means ±3 pages from current are kept in DOM
   * - Reduces initial load from ~100MB to ~10MB
   */
  const {
    state: loaderState,
    progress,
    status,
    error: loaderError,
    setFetchingData,
    setPreloadingImages,
    setInitializingEngine,
    setReady,
    setError,
    preloadImages
  } = useFlipbookLoader({
    preloadCount: 5, // Lazy load: Only preload first 5 pages, rest load on-demand
    parallelLoading: true,
    maxConcurrent: 6
  });

  const loadFeaturedFlipbook = useCallback(async () => {
    try {
      // Step 1: Fetch flipbook data
      setFetchingData();
      console.log('Fetching featured flipbook from:', `${API_URL}/api/flipbooks/featured/current`);
      
      const res = await fetch(`${API_URL}/api/flipbooks/featured/current`, {
        headers: { Authorization: AUTH_HEADER },
      });
      
      console.log('Featured flipbook response:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch featured flipbook:', res.status, errorText);
        setError('Unable to load catalog from server');
        return;
      }

      const data = await res.json();
      console.log('Featured flipbook data:', data);
      
      if (!data || !data.pages || data.pages.length === 0) {
        console.log('No featured flipbook data returned');
        setError('No featured catalog available');
        return;
      }

      setFlipbook(data);

      // If the featured flipbook changed, clear SW caches to avoid stale pages
      if (typeof window !== 'undefined') {
        const lastFeaturedId = window.localStorage.getItem('featuredFlipbookId');
        if (lastFeaturedId && lastFeaturedId !== data.id && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
          console.log('Clearing service worker cache due to featured flipbook change');
        }
        window.localStorage.setItem('featuredFlipbookId', data.id);
      }

      // Hotspots are already included in data.pages[].hotspots from the API response
      // No need to re-fetch them separately

      // Step 2: Preload images (lazy load: only first few pages)
      setPreloadingImages();
      const imageUrls = data.pages
        .sort((a: any, b: any) => a.pageNumber - b.pageNumber)
        .map((page: any) => resolveImageUrl(page.imageUrl, API_URL))
        .filter(Boolean);

      // Only preload first 5 pages for faster initial load
      const pagesToPreload = imageUrls.slice(0, 5);
      
      // Ask Service Worker to pre-cache the first N pages using resolved URLs
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_FLIPBOOK_PAGES',
          payload: { pages: pagesToPreload }
        });
        // Alternatively, instruct SW to fetch via API if needed
        navigator.serviceWorker.controller.postMessage({
          type: 'PRECACHE_FIRST_PAGES',
          payload: { apiUrl: API_URL, flipbookId: data.id, count: 3 }
        });
      }

      if (pagesToPreload.length > 0) {
        await preloadImages(pagesToPreload);
      }

      // Step 3: Initialize engine (wait for mount)
      setInitializingEngine();
      
    } catch (error) {
      console.error("Failed to load featured flipbook:", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setFetchingData, setPreloadingImages, setInitializingEngine, setError, preloadImages]);

  useEffect(() => {
    loadFeaturedFlipbook();
  }, [loadFeaturedFlipbook]);

  // Step 4: Mark as ready when flipbook is mounted and initialized
  useEffect(() => {
    if (isFlipbookMounted && loaderState === 'INITIALIZING_ENGINE') {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setReady();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isFlipbookMounted, loaderState, setReady]);

  const handleFlipbookMount = useCallback(() => {
    setIsFlipbookMounted(true);
  }, []);

  const handleRetry = useCallback(() => {
    setFlipbook(null);
    setIsFlipbookMounted(false);
    loadFeaturedFlipbook();
  }, [loadFeaturedFlipbook]);

  const handleHotspotClick = (hotspot: any) => {
    if (hotspot.linkUrl) {
      // Always open product/shop links in new tab for better UX
      if (hotspot.linkUrl.includes('/shop/') || hotspot.productSku) {
        window.open(hotspot.linkUrl, '_blank', 'noopener,noreferrer');
      } else if (hotspot.linkUrl.startsWith('http')) {
        // External URL - open in new tab
        window.open(hotspot.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Relative URL - navigate in same window
        window.location.href = hotspot.linkUrl;
      }
    } else if (hotspot.productSku) {
      // Open product page in new tab
      window.open(`/shop/${encodeURIComponent(hotspot.productSku)}`, '_blank', 'noopener,noreferrer');
    } else if (hotspot.productSku) {
      // Navigate to product page in same window
      window.location.href = `/shop/${hotspot.productSku}`;
    }
  };

  // Show error fallback
  if (loaderState === 'ERROR') {
    return (
      <FlipbookErrorFallback
        error={loaderError || 'Failed to load catalog'}
        onRetry={handleRetry}
      />
    );
  }

  // Don't render anything if no flipbook data yet
  if (!flipbook || !flipbook.pages || flipbook.pages.length === 0) {
    // Show loader while fetching
    if (loaderState === 'FETCHING_DATA') {
      return (
        <div className="relative min-h-[600px] bg-muted/20 rounded-lg">
          <FlipbookLoader progress={progress} status={status} />
        </div>
      );
    }
    return null;
  }

  // Map API pages to EnhancedFlipBook format with hotspots
  const pages: FlipbookPage[] = flipbook.pages
    .sort((a: any, b: any) => a.pageNumber - b.pageNumber) // Ensure pages are sorted by pageNumber
    .map((page: any, index: number) => {
      const hotspots = page.hotspots || [];
      if (index < 5) {
        console.log(`Page ${page.pageNumber} hotspots:`, hotspots.length);
      }
      return {
        id: page.id,
        src: resolveImageUrl(page.imageUrl, API_URL),
        pageNumber: page.pageNumber,
        alt: index === 0 ? flipbook.description || `${flipbook.title}` : `Page ${page.pageNumber}`,
        title: index === 0 ? flipbook.title : undefined, // Add title to first page for centered display
        hotspots,
        // Optionally add thumbnailSrc if available
        // thumbnailSrc: page.thumbnailUrl,
      };
    });

  // Optionally, build a TOC if your API provides it or you want to hardcode
  const toc: TOCEntry[] = [
    { title: "Cover", pageIndex: 0 },
    // Add more entries as needed
  ];

  return (
    <>
      <div className="bg-white text-black text-center py-2 px-6 mb-4">
        <h1 className="text-4xl font-bold">{flipbook.title}</h1>
        {flipbook.description && (
          <p className="text-base text-gray-700 mt-1">{flipbook.description}</p>
        )}
      </div>
      <div className="flipbook-canvas-container border-0 relative">
        {/* Show loader overlay until ready */}
        {loaderState !== 'READY' && (
          <FlipbookLoader 
            progress={progress} 
            status={status}
            className="rounded-lg"
          />
        )}
        
        <div className="flex justify-center w-full">
          <EnhancedFlipBook
            pages={pages}
            toc={toc}
            flipbookId={flipbook.id}
            initialPage={initialPage}
            onMount={handleFlipbookMount}
            config={{
              width: flipbookDimensions.width,
              height: flipbookDimensions.height,
              minWidth: 300,
              maxWidth: 700,
              minHeight: 400,
              maxHeight: 933,
              size: 'stretch',
              maxShadowOpacity: 0.65,
              showCover: true,
              showPageNumbers: true,
              enableSpread: true,
              autoPlayOnMount: false,
              autoPlayInterval: 3000,
              showThumbnails: false,
              showTOC: false,
              enableZoom: true,
              enableFullscreen: true,
              enableKeyboard: true,
              enableURLSync: true,
              preloadPages: 3,
            }}
            onPageChange={(pageIndex) => {
              // Pre-cache upcoming pages in Service Worker for smooth navigation
              if (flipbook?.pages) {
                cacheUpcomingPages(pageIndex, flipbook.pages, API_URL);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
