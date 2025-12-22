"use client";

import { useState, useEffect, useCallback } from "react";
import { EnhancedFlipBook } from "@/components/flipbook/EnhancedFlipBook";
import { FlipbookLoader } from "@/components/flipbook/FlipbookLoader";
import { FlipbookErrorFallback } from "@/components/flipbook/FlipbookErrorFallback";
import { useFlipbookLoader } from "@/hooks/useFlipbookLoader";
import type { FlipbookPage, TOCEntry } from "@/types/flipbook-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

export function FeaturedFlipbook() {
  const [flipbook, setFlipbook] = useState<any>(null);
  const [isFlipbookMounted, setIsFlipbookMounted] = useState(false);
  
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
    preloadCount: -1, // Preload all images
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

      // Step 2: Preload images
      setPreloadingImages();
      const imageUrls = data.pages
        .sort((a: any, b: any) => a.pageNumber - b.pageNumber)
        .map((page: any) => page.imageUrl)
        .filter(Boolean);

      if (imageUrls.length > 0) {
        await preloadImages(imageUrls);
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
      if (hotspot.linkUrl.startsWith("http")) {
        window.open(hotspot.linkUrl, "_blank");
      }
    } else if (hotspot.productSku) {
      // Could navigate to product page
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
    .map((page: any, index: number) => ({
      id: page.id,
      src: page.imageUrl,
      pageNumber: page.pageNumber,
      alt: index === 0 ? flipbook.description || `${flipbook.title}` : `Page ${page.pageNumber}`,
      title: index === 0 ? flipbook.title : undefined, // Add title to first page for centered display
      hotspots: page.hotspots || [],
      // Optionally add thumbnailSrc if available
      // thumbnailSrc: page.thumbnailUrl,
    }));

  // Optionally, build a TOC if your API provides it or you want to hardcode
  const toc: TOCEntry[] = [
    { title: "Cover", pageIndex: 0 },
    // Add more entries as needed
  ];

  return (
    <>
      <div className="bg-white text-black text-center py-2 px-6 mb-0">
        <h1 className="text-4xl font-bold">{flipbook.title}</h1>
        {flipbook.description && (
          <p className="text-sm text-gray-700 mt-1">{flipbook.description}</p>
        )}
      </div>
      <div className="flipbook-canvas-container m-0 p-0 border-0 relative">
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
            onMount={handleFlipbookMount}
            config={{
              width: 420,
              height: 560,
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
              // Optionally handle page change
            }}
          />
        </div>
      </div>
    </>
  );
}
