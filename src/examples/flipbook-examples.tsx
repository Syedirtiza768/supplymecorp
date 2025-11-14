/**
 * Enhanced Flipbook - Usage Examples
 * 
 * This file contains various usage examples for the EnhancedFlipBook component.
 * Copy and paste these examples into your own components.
 */

import { EnhancedFlipBook } from '@/components/flipbook';
import type { FlipbookPage, TOCEntry, FlipbookConfig } from '@/types/flipbook-types';

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicFlipbookExample() {
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/page1.jpg', alt: 'Page 1' },
    { id: 2, src: '/images/page2.jpg', alt: 'Page 2' },
    { id: 3, src: '/images/page3.jpg', alt: 'Page 3' },
  ];

  return <EnhancedFlipBook pages={pages} />;
}

// ============================================================================
// Example 2: With Configuration
// ============================================================================

export function ConfiguredFlipbookExample() {
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/page1.jpg', alt: 'Page 1' },
    { id: 2, src: '/images/page2.jpg', alt: 'Page 2' },
  ];

  const config: FlipbookConfig = {
    width: 450,
    height: 600,
    enableZoom: true,
    enableFullscreen: true,
    showThumbnails: true, // Start with thumbnails visible
    autoPlayInterval: 5000, // 5 seconds per page
  };

  return <EnhancedFlipBook pages={pages} config={config} />;
}

// ============================================================================
// Example 3: With Table of Contents
// ============================================================================

export function FlipbookWithTOCExample() {
  const pages: FlipbookPage[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    src: `/images/page${i + 1}.jpg`,
    alt: `Page ${i + 1}`,
  }));

  const toc: TOCEntry[] = [
    { title: 'Introduction', pageIndex: 0 },
    { 
      title: 'Part 1: Getting Started', 
      pageIndex: 5,
      children: [
        { title: 'Chapter 1: Basics', pageIndex: 6 },
        { title: 'Chapter 2: Advanced', pageIndex: 15 },
      ]
    },
    { title: 'Part 2: Reference', pageIndex: 25 },
    { title: 'Conclusion', pageIndex: 45 },
  ];

  return <EnhancedFlipBook pages={pages} toc={toc} />;
}

// ============================================================================
// Example 4: With Event Handlers
// ============================================================================

export function FlipbookWithEventsExample() {
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/page1.jpg', alt: 'Page 1' },
    { id: 2, src: '/images/page2.jpg', alt: 'Page 2' },
  ];

  const handlePageChange = (pageIndex: number) => {
    console.log('User navigated to page:', pageIndex + 1);
    // Track analytics, update state, etc.
  };

  const handleFullscreenChange = (isFullscreen: boolean) => {
    console.log('Fullscreen:', isFullscreen);
  };

  const handleZoomChange = (zoomLevel: number) => {
    console.log('Zoom level:', Math.round(zoomLevel * 100) + '%');
  };

  return (
    <EnhancedFlipBook 
      pages={pages}
      onPageChange={handlePageChange}
      onFullscreenChange={handleFullscreenChange}
      onZoomChange={handleZoomChange}
    />
  );
}

// ============================================================================
// Example 5: Fetching Pages from API
// ============================================================================

export function DynamicFlipbookExample() {
  const [pages, setPages] = React.useState<FlipbookPage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch('/api/flipbook/images');
        const imageFiles = await response.json();
        
        const flipbookPages = imageFiles.map((filename: string, index: number) => ({
          id: index + 1,
          src: `/images/flipbook/${filename}`,
          alt: `Page ${index + 1}`,
        }));
        
        setPages(flipbookPages);
      } catch (error) {
        console.error('Failed to load pages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading flipbook...</div>;
  }

  return <EnhancedFlipBook pages={pages} />;
}

// ============================================================================
// Example 6: With Custom Loading and Error Components
// ============================================================================

export function CustomizedFlipbookExample() {
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/page1.jpg', alt: 'Page 1' },
  ];

  const customLoading = (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold">Loading your catalog...</p>
      </div>
    </div>
  );

  const customError = (
    <div className="flex items-center justify-center h-96">
      <div className="text-center text-red-600">
        <p className="text-xl font-bold mb-2">Oops!</p>
        <p>We couldn't load the flipbook. Please try again later.</p>
      </div>
    </div>
  );

  return (
    <EnhancedFlipBook 
      pages={pages}
      loadingComponent={customLoading}
      errorComponent={customError}
    />
  );
}

// ============================================================================
// Example 7: Using Ref for Programmatic Control
// ============================================================================

export function ControlledFlipbookExample() {
  const flipbookRef = React.useRef<FlipbookRef>(null);
  
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/page1.jpg', alt: 'Page 1' },
    { id: 2, src: '/images/page2.jpg', alt: 'Page 2' },
    { id: 3, src: '/images/page3.jpg', alt: 'Page 3' },
  ];

  const goToPage = (pageNumber: number) => {
    flipbookRef.current?.goToPage(pageNumber - 1); // Convert to 0-based
  };

  const toggleFullscreen = () => {
    flipbookRef.current?.toggleFullscreen();
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => goToPage(1)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Page 1
        </button>
        <button onClick={() => goToPage(2)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Page 2
        </button>
        <button onClick={toggleFullscreen} className="px-4 py-2 bg-green-500 text-white rounded">
          Toggle Fullscreen
        </button>
      </div>
      
      <EnhancedFlipBook ref={flipbookRef} pages={pages} />
    </div>
  );
}

// ============================================================================
// Example 8: Product Catalog with Categories
// ============================================================================

export function ProductCatalogExample() {
  const pages: FlipbookPage[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    src: `/images/catalog/page${i + 1}.jpg`,
    alt: `Catalog page ${i + 1}`,
    thumbnailSrc: `/images/catalog/thumbs/page${i + 1}.jpg`, // Smaller thumbnails
  }));

  const toc: TOCEntry[] = [
    { title: 'Cover', pageIndex: 0 },
    { 
      title: 'Power Tools', 
      pageIndex: 10,
      children: [
        { title: 'Drills', pageIndex: 11 },
        { title: 'Saws', pageIndex: 18 },
        { title: 'Sanders', pageIndex: 25 },
      ]
    },
    { 
      title: 'Hand Tools', 
      pageIndex: 35,
      children: [
        { title: 'Hammers', pageIndex: 36 },
        { title: 'Screwdrivers', pageIndex: 42 },
        { title: 'Wrenches', pageIndex: 50 },
      ]
    },
    { title: 'Safety Equipment', pageIndex: 60 },
    { title: 'Accessories', pageIndex: 75 },
    { title: 'Special Offers', pageIndex: 90 },
  ];

  const config: FlipbookConfig = {
    enableURLSync: true, // Allow sharing specific pages
    showPageNumbers: true,
    preloadPages: 5, // Preload more pages for smooth navigation
  };

  return (
    <EnhancedFlipBook 
      pages={pages}
      toc={toc}
      config={config}
      onPageChange={(page) => {
        // Track page views for analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'catalog_page_view', {
            page_number: page + 1,
          });
        }
      }}
    />
  );
}

// ============================================================================
// Example 9: Magazine Layout
// ============================================================================

export function MagazineExample() {
  const pages: FlipbookPage[] = [
    { id: 1, src: '/images/magazine/cover.jpg', alt: 'Cover' },
    ...Array.from({ length: 50 }, (_, i) => ({
      id: i + 2,
      src: `/images/magazine/page${i + 1}.jpg`,
      alt: `Page ${i + 1}`,
    })),
  ];

  const config: FlipbookConfig = {
    showCover: true, // Display cover differently
    enableSpread: true, // Two-page spread
    showPageNumbers: false, // Magazines often don't show page numbers
    maxShadowOpacity: 0.3, // Subtle shadow
  };

  return <EnhancedFlipBook pages={pages} config={config} />;
}

// ============================================================================
// Example 10: Real-world Integration (like MyFlipBookEnhanced)
// ============================================================================

export function RealWorldExample() {
  const [pages, setPages] = React.useState<FlipbookPage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const res = await fetch('/api/flipbook/images');
        if (!res.ok) throw new Error('Failed to fetch images');
        
        let files = await res.json();
        
        // Sort numerically
        files = files.sort((a: string, b: string) => {
          const getNum = (name: string) => {
            const match = name.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };
          return getNum(a) - getNum(b);
        });
        
        const flipbookPages: FlipbookPage[] = files.map((filename: string, index: number) => ({
          id: index + 1,
          src: `/images/flipbook/${filename}`,
          alt: `Catalog page ${index + 1}`,
        }));
        
        setPages(flipbookPages);
      } catch (err) {
        setError('Failed to load flipbook images');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const toc: TOCEntry[] = [
    { title: 'Cover', pageIndex: 0 },
    { title: 'Spring Collection', pageIndex: 10 },
    { title: 'Summer Collection', pageIndex: 50 },
    { title: 'New Arrivals', pageIndex: 100 },
    { title: 'Special Offers', pageIndex: 150 },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!pages.length) return <div>No pages found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          2025 Spring & Summer Catalog
        </h1>
        
        <EnhancedFlipBook 
          pages={pages}
          toc={toc}
          config={{
            width: 400,
            height: 550,
            enableZoom: true,
            enableFullscreen: true,
            enableKeyboard: true,
            enableURLSync: true,
            showThumbnails: false,
            showTOC: false,
            autoPlayInterval: 3000,
            preloadPages: 3,
          }}
          onPageChange={(pageIndex) => {
            console.log('Viewing page:', pageIndex + 1);
          }}
        />
      </div>
    </div>
  );
}

// Helper to prevent TypeScript errors
import React from 'react';
import type { FlipbookRef } from '@/types/flipbook-types';

// Note: To use these examples, import them in your page/component:
// import { BasicFlipbookExample } from '@/examples/flipbook-examples';
