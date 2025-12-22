/**
 * EnhancedFlipBook Component
 * A fully-featured HTML5 flipbook viewer with:
 * - Page-flip animations
 * - Responsive layout (spread on desktop, single on mobile)
 * - Navigation controls
 * - Keyboard navigation
 * - Thumbnails
 * - Table of contents
 * - Zoom & pan
 * - Fullscreen mode
 * - Lazy loading
 * - Deep linking
 */

"use client";

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import { useFlipbookState } from '@/hooks/useFlipbookState';
import { downloadFlipbookPDF } from '@/lib/flipbooks';
import { FlipbookToolbar } from './FlipbookToolbar';
import { FlipbookZoomControls, usePanAndZoom } from './FlipbookZoomControls';
import { FlipbookThumbnails } from './FlipbookThumbnails';
import { FlipbookTOC } from './FlipbookTOC';
import { FlipbookKeyboardHandler } from './FlipbookKeyboardHandler';
import type {
  EnhancedFlipBookProps,
  FlipbookRef,
  FlipbookPage,
  FlipbookConfig,
} from '@/types/flipbook-types';

// Dynamically import react-pageflip to avoid SSR issues
const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading flipbook...</p>
      </div>
    </div>
  ),
});

const defaultConfig: FlipbookConfig = {
  width: 400,
  height: 500,
  minWidth: 315,
  maxWidth: 1000,
  minHeight: 400,
  maxHeight: 1536,
  size: 'stretch',
  maxShadowOpacity: 0,
  showCover: false,
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
};

export const EnhancedFlipBook = forwardRef<FlipbookRef, EnhancedFlipBookProps & { flipbookId?: string }>(
  (
    {
      pages = [],
      config: userConfig = {},
      toc = [],
      initialPage = 0,
      onPageChange,
      onFullscreenChange,
      onZoomChange,
      onMount,
      loadingComponent,
      errorComponent,
      className = '',
      flipbookId,
    },
    ref
  ) => {
    const config = { ...defaultConfig, ...userConfig };
    const [state, actions] = useFlipbookState({
      totalPages: pages.length,
      initialPage,
      config,
      onPageChange,
      onFullscreenChange,
      onZoomChange,
    });

    const bookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showCoverClass, setShowCoverClass] = useState(true);
    const pendingFlipRef = useRef<number | null>(null);

    // Track if we're on the cover page
    const isOnCoverPage = state.currentPage === 0 && config.showCover && showCoverClass;

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      getCurrentPage: () => state.currentPage,
      goToPage: actions.goToPage,
      enterFullscreen: () => {
        if (!state.isFullscreen) {
          actions.toggleFullscreen();
        }
      },
      exitFullscreen: () => {
        if (state.isFullscreen) {
          actions.toggleFullscreen();
        }
      },
      toggleFullscreen: actions.toggleFullscreen,
    }));

    // Client-side only
    useEffect(() => {
      setIsClient(true);
      
      // Check if mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, []);

    // Call onMount when component is ready
    useEffect(() => {
      if (isClient && pages.length > 0 && onMount) {
        // Small delay to ensure the flipbook library is initialized
        const timer = setTimeout(() => {
          onMount();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isClient, pages.length, onMount]);

    // Pan and zoom handling
    const panAndZoom = usePanAndZoom({
      zoomLevel: state.zoomLevel,
      panOffset: state.panOffset,
      setPanOffset: actions.setPanOffset,
      containerRef: contentRef as React.RefObject<HTMLDivElement>,
    });

    // Sync bookRef page with state (simplified to avoid errors)
    useEffect(() => {
      if (!bookRef.current) return;
      
      // Reset cover class when returning to page 0
      if (state.currentPage === 0 && config.showCover) {
        setShowCoverClass(true);
      }
      
      try {
        // Use timeout to ensure flipbook is initialized
        const timer = setTimeout(() => {
          if (bookRef.current?.pageFlip) {
            const flipInstance = bookRef.current.pageFlip();
            if (flipInstance?.flip && typeof flipInstance.flip === 'function') {
              flipInstance.flip(state.currentPage);
            }
          }
        }, 100);
        
        return () => clearTimeout(timer);
      } catch (err) {
        // Silently handle errors
      }
    }, [state.currentPage, config.showCover]);

    // Handle manual click on cover page
    const handleCoverClick = useCallback((e: React.MouseEvent) => {
      if (isOnCoverPage && !isTransitioning) {
        e.preventDefault();
        e.stopPropagation();
        
        setIsTransitioning(true);
        
        // Remove cover class to trigger CSS transition
        setShowCoverClass(false);
        
        // Wait for CSS transition (600ms) then actually flip to next page
        setTimeout(() => {
          actions.goToPage(1);
          setIsTransitioning(false);
        }, 600);
      }
    }, [isOnCoverPage, isTransitioning, actions]);

    // Handle page flip from react-pageflip
    const handleFlip = useCallback(
      (e: any) => {
        const newPage = e.data;
        if (newPage !== state.currentPage && !isTransitioning) {
          actions.goToPage(newPage);
        }
      },
      [state.currentPage, actions, isTransitioning]
    );

    // Download handler
    const handleDownload = useCallback(() => {
      if (!pages || pages.length === 0) return;
      const id = flipbookId || 'flipbook';
      downloadFlipbookPDF(id, `${id}.pdf`).catch((err) => {
        alert('Failed to download PDF: ' + err.message);
      });
    }, [pages, flipbookId]);


    // Share handler
    const handleShare = useCallback(async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Catalog',
            text: 'Check out this catalog!',
            url: window.location.href,
          });
        } catch (err) {
          console.log('Error sharing:', err);
        }
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }, []);

    // Loading state
    if (!isClient) {
      return loadingComponent || (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading flipbook...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (state.error) {
      return errorComponent || (
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{state.error}</p>
          </div>
        </div>
      );
    }

    // No pages state
    if (pages.length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No pages to display</p>
        </div>
      );
    }

    return (
      <div
        id="flipbook-container"
        ref={containerRef}
        className={`flipbook-enhanced flipbook-canvas-texture w-full h-full ${state.isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}
        onFocus={() => actions.setFocused(true)}
        onBlur={() => actions.setFocused(false)}
        tabIndex={0}
      >
        {/* Keyboard handler */}
        <FlipbookKeyboardHandler
          actions={actions}
          enabled={config.enableKeyboard ?? true}
          isFocused={state.isFocused}
          state={state}
        />

        <div className="flex flex-col h-full m-0 p-0">
          {/* Toolbar - always on top */}
          <div className="relative z-[100] m-0 p-0 border-0">
            <FlipbookToolbar
              state={state}
              actions={actions}
              showThumbnailsToggle={config.showThumbnails}
              showTOCToggle={config.showTOC && toc.length > 0}
              onDownload={handleDownload}
              // onPrint removed
              onShare={handleShare}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex min-h-0 overflow-hidden m-0 p-0 border-0 bg-white">
            {/* TOC Sidebar */}
            {state.showTOC && toc.length > 0 && (
              <div className="w-64 flex-shrink-0 overflow-hidden">
                <FlipbookTOC
                  entries={toc}
                  currentPage={state.currentPage}
                  onPageSelect={actions.goToPage}
                  onClose={isMobile ? actions.toggleTOC : undefined}
                  className="h-full"
                />
              </div>
            )}

            {/* Flipbook viewer */}
            <div className="flex-1 flex flex-col items-center min-w-0 m-0 p-0">
              <div
                ref={contentRef}
                className={`relative flex items-center justify-center w-full flex-1 ${isOnCoverPage && !isMobile ? 'cover-page-active' : ''}`}
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/images/flipbook/winter-background.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#ffffff",
                  cursor: state.zoomLevel > 1 ? panAndZoom.cursor : undefined
                }}
                onClick={(e) => {
                  // Automatically consume first click after returning to stabilize flipbook
                  if (state.needsStabilization) {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.stabilize();
                    return;
                  }
                }}
                onMouseDown={(e) => {
                  // Consume mousedown to prevent drag start when stabilizing
                  if (state.needsStabilization) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  // Handle pan and zoom when zoomed in
                  if (state.zoomLevel > 1) {
                    panAndZoom.handleMouseDown(e);
                  }
                }}
                onTouchStart={(e) => {
                  // Handle pan and zoom when zoomed in
                  if (state.zoomLevel > 1) {
                    panAndZoom.handleTouchStart(e);
                  }
                }}
                onClick={handleCoverClick}
              >
                {isClient && (
                  // @ts-ignore - react-pageflip has complex typing
                  <HTMLFlipBook
                    width={config.width ?? 400}
                    height={config.height ?? 500}
                    size={config.size ?? 'stretch'}
                    minWidth={config.minWidth ?? 315}
                    maxWidth={config.maxWidth ?? 1000}
                    minHeight={config.minHeight ?? 400}
                    maxHeight={config.maxHeight ?? 1536}
                    maxShadowOpacity={0}
                    flippingTime={800} // Adjust flipping time for smoother transitions
                    disableFlipByClick={state.needsStabilization || isOnCoverPage} // Disable click flipping when stabilizing or on cover
                    showCover={config.showCover ?? false}
                    usePortrait={isMobile}
                    mobileScrollSupport={isMobile}
                    className=""
                    ref={bookRef}
                    onFlip={handleFlip}
                  >
                    {pages.map((page, index) => (
                      <FlipbookPageComponent
                        key={page.id}
                        page={page}
                        index={index}
                        currentPage={state.currentPage}
                        preloadPages={config.preloadPages ?? 3}
                      />
                    ))}
                  </HTMLFlipBook>
                )
                }

                {/* Page indicator overlay */}
                {config.showPageNumbers && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-white text-sm font-medium">
                    Page {state.currentPage + 1} of {state.totalPages}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {state.showThumbnails && (
            <div className="mt-4">
              <FlipbookThumbnails
                pages={pages}
                currentPage={state.currentPage}
                onPageSelect={actions.goToPage}
                onClose={isMobile ? actions.toggleThumbnails : undefined}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

EnhancedFlipBook.displayName = 'EnhancedFlipBook';

/**
 * Individual page component with lazy loading
 * Must use forwardRef for react-pageflip to work properly
 */
interface FlipbookPageComponentProps {
  page: FlipbookPage;
  index: number;
  currentPage: number;
  preloadPages: number;
}

const FlipbookPageComponent = React.forwardRef<HTMLDivElement, FlipbookPageComponentProps>(
  ({ page, index, currentPage, preloadPages }, ref) => {
    const [shouldLoad, setShouldLoad] = useState(() => Math.abs(index - currentPage) <= preloadPages);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Lazy loading logic: render only pages within the preload range buffer
    useEffect(() => {
      const distance = Math.abs(index - currentPage);
      setShouldLoad(distance <= preloadPages);
    }, [index, currentPage, preloadPages]);

    // Reset load flag when page is unloaded so it re-displays correctly when revisited
    useEffect(() => {
      if (!shouldLoad && hasLoaded) {
        setHasLoaded(false);
      }
    }, [shouldLoad, hasLoaded]);

    const handleHotspotClick = (hotspot: any) => {
      console.log('Hotspot clicked:', hotspot);
      if (hotspot.linkUrl) {
        if (hotspot.linkUrl.startsWith('http')) {
          window.open(hotspot.linkUrl, '_blank');
        } else {
          window.location.href = hotspot.linkUrl;
        }
      } else if (hotspot.productSku) {
        window.location.href = `/shop?search=${encodeURIComponent(hotspot.productSku)}`;
      }
    };

    // Log hotspots for this page in development
    useEffect(() => {
      if (process.env.NODE_ENV === 'development' && hasLoaded && page.hotspots) {
        console.log(`Page ${index + 1} has ${page.hotspots.length} hotspot(s)`, page.hotspots);
      }
    }, [hasLoaded, page.hotspots, index]);

    // Check if this is the title page (first page)
    const isTitlePage = index === 0 && page.title;

    return (
      <div 
        ref={ref}
        className={`flex items-center justify-center w-full h-full relative flipbook-page bg-white`}
        style={{ minHeight: 0, minWidth: 0 }}
      >
        {shouldLoad ? (
          <>
            <img
              src={page.src}
              alt={page.alt || `Page ${index + 1}`}
              className="w-auto h-auto transition-opacity duration-300"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: 'auto',
                pointerEvents: 'none'
              }}
              onLoad={() => setHasLoaded(true)}
            />
            {/* Page number badge */}
            {hasLoaded && (
              <div className="flipbook-page-number">
                {index + 1}
              </div>
            )}
            {/* Hotspots overlay: invisible by default, highlight on hover, open links in new tab, skip empty */}
            {hasLoaded && Array.isArray(page.hotspots) && page.hotspots.length > 0 && (
              <div className="absolute inset-0 pointer-events-none z-[99999]">
                <div className="relative w-full h-full">
                  {page.hotspots.filter(h => (h.linkUrl || h.productSku)).map((hotspot) => (
                    <button
                      key={hotspot.id}
                      type="button"
                      className="absolute group pointer-events-auto cursor-pointer"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        width: `${hotspot.width}%`,
                        height: `${hotspot.height}%`,
                        zIndex: (hotspot.zIndex ?? 0) + 1000,
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                      }}
                      title={hotspot.label || hotspot.productSku || ''}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        if (hotspot.linkUrl) {
                          window.open(hotspot.linkUrl, '_blank', 'noopener,noreferrer');
                        } else if (hotspot.productSku) {
                          window.open(`/shop?search=${encodeURIComponent(hotspot.productSku)}`, '_blank', 'noopener,noreferrer');
                        }
                        return false;
                      }}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                      onMouseUp={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                      onMouseMove={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                      onTouchStart={e => {
                        e.stopPropagation();
                      }}
                      onTouchMove={e => {
                        e.stopPropagation();
                      }}
                      onTouchEnd={e => {
                        e.stopPropagation();
                      }}
                    >
                      {/* No custom tooltip, just default browser tooltip */}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

FlipbookPageComponent.displayName = 'FlipbookPageComponent';
