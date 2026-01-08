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

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useFlipbookState } from '@/hooks/useFlipbookState';
import { downloadFlipbookPDF } from '@/lib/flipbooks';
import { FlipbookToolbar } from './FlipbookToolbar';
import { FlipbookZoomControls, usePanAndZoom } from './FlipbookZoomControls';
import { FlipbookThumbnails } from './FlipbookThumbnails';
import { FlipbookTOC } from './FlipbookTOC';
import { FlipbookKeyboardHandler } from './FlipbookKeyboardHandler';
import '@/styles/flipbook.css';
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
  width: 1200,
  height: 1600,
  minWidth: 600,
  maxWidth: 1200,
  minHeight: 800,
  maxHeight: 1600,
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
    const [flipAnim, setFlipAnim] = useState<{ active: boolean; direction: 'forward' | 'backward'; progress: number; activePageIndex: number | null; dragX: number; dragY: number }>({
      active: false,
      direction: 'forward',
      progress: 0,
      activePageIndex: null,
      dragX: 0,
      dragY: 0,
    });
    const flipAnimRaf = useRef<number | null>(null);
    const lastFlipDirectionRef = useRef<'forward' | 'backward'>('forward');
    const isMountedRef = useRef(true);
    const lastDragPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    // Track programmatic flips to prevent handleFlip from interfering
    const isProgrammaticFlipRef = useRef(false);
    const programmaticTargetRef = useRef<number | null>(null);
    // Track if initial URL page navigation has happened
    const hasInitializedFromURL = useRef(false);

    // Cleanup RAF and track mount state
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
        if (flipAnimRaf.current) {
          cancelAnimationFrame(flipAnimRaf.current);
        }
      };
    }, []);

    const stopFlipAnimation = useCallback(() => {
      if (flipAnimRaf.current) {
        cancelAnimationFrame(flipAnimRaf.current);
        flipAnimRaf.current = null;
      }
      if (isMountedRef.current) {
        setFlipAnim((prev) => ({ ...prev, active: false, progress: 0, activePageIndex: null, dragX: 0, dragY: 0 }));
      }
    }, []);

    const triggerFlipAnimation = useCallback(
      (direction: 'forward' | 'backward', pageIndex?: number) => {
        lastFlipDirectionRef.current = direction;
        if (flipAnimRaf.current) {
          cancelAnimationFrame(flipAnimRaf.current);
        }

        const duration = (config.flippingTime ?? 950) + 280;
        const start = performance.now();
        const activePageIdx = pageIndex ?? (direction === 'forward' ? state.currentPage + 1 : state.currentPage - 1);

        const step = (now: number) => {
          const elapsed = now - start;
          const linearProgress = Math.min(elapsed / duration, 1);
          // Apply single smooth cubic-bezier easing for natural motion
          // This creates: slow start → smooth middle → gentle finish
          let easedProgress = linearProgress;
          if (linearProgress < 1) {
            // Cubic easing: fast middle, slow edges
            easedProgress = linearProgress < 0.5
              ? 4 * linearProgress * linearProgress * linearProgress
              : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;
          }
          if (isMountedRef.current) {
            setFlipAnim({
              active: linearProgress < 1,
              direction,
              progress: linearProgress < 1 ? easedProgress : 0,
              activePageIndex: linearProgress < 1 ? activePageIdx : null,
              dragX: lastDragPos.current.x,
              dragY: lastDragPos.current.y,
            });
          }

          if (linearProgress < 1) {
            flipAnimRaf.current = requestAnimationFrame(step);
          } else {
            flipAnimRaf.current = null;
          }
        };

        setFlipAnim({ active: true, direction, progress: 0, activePageIndex: activePageIdx, dragX: 0, dragY: 0 });
        flipAnimRaf.current = requestAnimationFrame(step);
      },
      [config.flippingTime, state.currentPage]
    );

    // Preserve original page numbers so "go to page" uses catalog numbering even if file names or indexes differ
    const pageNumbers = useMemo(() => pages.map((page, idx) => page.pageNumber ?? idx + 1), [pages]);
    const currentDisplayPage = pageNumbers[state.currentPage] ?? state.currentPage + 1;
    const maxDisplayPage = pageNumbers.length ? pageNumbers[pageNumbers.length - 1] : state.totalPages;

    // Track if we're on the cover page
    const isOnCoverPage = !!(state.currentPage === 0 && config.showCover && showCoverClass);

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

    // Navigate to initial page from URL once after flipbook is ready
    useEffect(() => {
      if (!isClient || !bookRef.current || hasInitializedFromURL.current) return;
      
      // Set flipbook ref for auto-play animated flips
      actions.setFlipbookRef(bookRef.current);
      
      if (initialPage === 0) {
        hasInitializedFromURL.current = true;
        return;
      }

      // Wait for flipbook library to be fully initialized
      const timer = setTimeout(() => {
        if (bookRef.current?.pageFlip) {
          const flipInstance = bookRef.current.pageFlip();
          if (flipInstance?.turnToPage && typeof flipInstance.turnToPage === 'function') {
            console.log('[EnhancedFlipBook] Initial URL navigation to page', initialPage);
            isProgrammaticFlipRef.current = true;
            programmaticTargetRef.current = initialPage;
            flipInstance.turnToPage(initialPage);
            hasInitializedFromURL.current = true;
            setTimeout(() => {
              isProgrammaticFlipRef.current = false;
              programmaticTargetRef.current = null;
            }, 1000);
          }
        }
      }, 800); // Longer delay to ensure library is fully ready

      return () => clearTimeout(timer);
    }, [isClient, initialPage]);

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
        // Mark this as a programmatic flip so handleFlip won't interfere
        isProgrammaticFlipRef.current = true;
        programmaticTargetRef.current = state.currentPage;

        // Use timeout to ensure flipbook is initialized
        const timer = setTimeout(() => {
          if (bookRef.current?.pageFlip) {
            const flipInstance = bookRef.current.pageFlip();
            if (flipInstance?.turnToPage && typeof flipInstance.turnToPage === 'function') {
              // Use turnToPage for instant navigation without animation interference
              console.log('[EnhancedFlipBook] Turning to page index (instant)', state.currentPage);
              flipInstance.turnToPage(state.currentPage);
            } else if (flipInstance?.flip && typeof flipInstance.flip === 'function') {
              console.log('[EnhancedFlipBook] Flipping to page index', state.currentPage);
              flipInstance.flip(state.currentPage);
            }
          }

          // Reset programmatic flip flag after a delay to allow animation to complete
          setTimeout(() => {
            isProgrammaticFlipRef.current = false;
            programmaticTargetRef.current = null;
          }, 1000);
        }, 100);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('[EnhancedFlipBook] Error flipping page:', err);
        isProgrammaticFlipRef.current = false;
        programmaticTargetRef.current = null;
      }
    }, [state.currentPage, config.showCover]);

    // Handle manual click on cover page
    const handleCoverClick = useCallback((e: React.MouseEvent) => {
      // Only handle if clicking the container directly, not child elements
      if (e.target !== e.currentTarget) return;

      if (isOnCoverPage && !isTransitioning) {
        e.preventDefault();
        e.stopPropagation();

        setIsTransitioning(true);
        setShowCoverClass(false);

        // Just go to page 1, let the regular flip mechanism handle it
        triggerFlipAnimation('forward');
        actions.goToPage(1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }
    }, [isOnCoverPage, isTransitioning, actions, triggerFlipAnimation]);

    // Handle page flip from react-pageflip
    const handleFlip = useCallback(
      (e: any) => {
        const newPage = e.data;
        const direction: 'forward' | 'backward' = newPage >= state.currentPage ? 'forward' : 'backward';

        // If this is a programmatic flip, only accept the final target page
        if (isProgrammaticFlipRef.current) {
          if (programmaticTargetRef.current !== null && newPage === programmaticTargetRef.current) {
            // We've reached the target, reset the flag
            console.log('[EnhancedFlipBook] Programmatic flip reached target', newPage);
            isProgrammaticFlipRef.current = false;
            programmaticTargetRef.current = null;
            triggerFlipAnimation(direction);
          } else {
            // Ignore intermediate pages during programmatic flip
            console.log('[EnhancedFlipBook] Ignoring intermediate page during programmatic flip', newPage);
            return;
          }
        }

        if (newPage !== state.currentPage && !isTransitioning) {
          console.log('[EnhancedFlipBook] Manual flip to page', newPage);
          triggerFlipAnimation(direction);
          actions.goToPage(newPage);
        }
      },
      [state.currentPage, actions, isTransitioning, triggerFlipAnimation]
    );

    // Track start/end of flip state from the library for gutter dynamics
    const handleChangeState = useCallback(
      (e: any) => {
        const stateName = e?.data;
        if (stateName === 'read') {
          stopFlipAnimation();
          return;
        }

        // For drag/flip states, ensure the dynamic gutter overlay is active
        triggerFlipAnimation(lastFlipDirectionRef.current);
      },
      [stopFlipAnimation, triggerFlipAnimation]
    );

    // Track drag position for dynamic lighting/curvature
    const handleChangeOrientation = useCallback(
      (e: any) => {
        // e.data contains orientation info; we can infer drag progress
        if (flipAnim.active && e?.data) {
          const orientation = e.data;
          // Store normalized drag position for CSS variables
          lastDragPos.current = { x: orientation || 0, y: 0 };
        }
      },
      [flipAnim.active]
    );

    // Track mouse/touch position during drag for responsive curvature and lighting
    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!flipAnim.active || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Normalized drag offset from center (-1 to 1)
        const dragX = (e.clientX - rect.left - centerX) / centerX;
        const dragY = (e.clientY - rect.top - centerY) / centerY;

        lastDragPos.current = {
          x: Math.max(-1, Math.min(1, dragX)),
          y: Math.max(-1, Math.min(1, dragY)),
        };

        // Update CSS variables for real-time responsive effects
        if (containerRef.current) {
          containerRef.current.style.setProperty('--drag-x', String(lastDragPos.current.x * 100));
          containerRef.current.style.setProperty('--drag-y', String(lastDragPos.current.y * 100));
        }
      },
      [flipAnim.active]
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!flipAnim.active || e.touches.length === 0 || !containerRef.current) return;

        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Normalized drag offset from center (-1 to 1)
        const dragX = (touch.clientX - rect.left - centerX) / centerX;
        const dragY = (touch.clientY - rect.top - centerY) / centerY;

        lastDragPos.current = {
          x: Math.max(-1, Math.min(1, dragX)),
          y: Math.max(-1, Math.min(1, dragY)),
        };

        // Update CSS variables for real-time responsive effects
        if (containerRef.current) {
          containerRef.current.style.setProperty('--drag-x', String(lastDragPos.current.x * 100));
          containerRef.current.style.setProperty('--drag-y', String(lastDragPos.current.y * 100));
        }
      },
      [flipAnim.active]
    );

    // Download handler
    const handleDownload = useCallback(() => {
      if (!pages || pages.length === 0) return;
      const id = flipbookId || 'flipbook';
      downloadFlipbookPDF(id, `${id}.pdf`).catch((err) => {
        alert('Failed to download PDF: ' + err.message);
      });
    }, [pages, flipbookId]);

    // Pinch-to-zoom handler for touch devices
    const lastPinchDistance = useRef<number | null>(null);
    const handlePinchZoom = useCallback(
      (e: React.TouchEvent) => {
        if (e.touches.length !== 2) {
          lastPinchDistance.current = null;
          return;
        }

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastPinchDistance.current !== null) {
          const delta = distance - lastPinchDistance.current;
          const zoomDelta = delta * 0.01; // Scale sensitivity
          const newZoom = Math.max(0.5, Math.min(3, state.zoomLevel + zoomDelta));
          actions.setZoom(newZoom);
        }

        lastPinchDistance.current = distance;
      },
      [state.zoomLevel, actions]
    );

    const handlePinchEnd = useCallback(() => {
      lastPinchDistance.current = null;
    }, []);

    // Double-tap to zoom handler
    const lastTapTime = useRef<number>(0);
    const handleDoubleTap = useCallback(
      (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;

        const now = Date.now();
        const timeDiff = now - lastTapTime.current;

        if (timeDiff < 300 && timeDiff > 0) {
          // Double tap detected
          e.preventDefault();
          if (state.zoomLevel === 1) {
            actions.setZoom(2); // Zoom in to 2x
          } else {
            actions.resetZoom(); // Reset to 1x
          }
        }

        lastTapTime.current = now;
      },
      [state.zoomLevel, actions]
    );


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
      <>
      <div
        id="flipbook-container"
        ref={containerRef}
        role="application"
        aria-label={`Flipbook viewer, page ${currentDisplayPage} of ${maxDisplayPage}`}
        aria-roledescription="flipbook"
        className={`flipbook-enhanced flipbook-canvas-texture w-full h-full ${state.isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${flipAnim.active ? 'flipbook-animating' : ''} ${className}`}
        style={{
          ['--flip-progress' as any]: flipAnim.active ? flipAnim.progress : 0,
          ['--flip-direction' as any]: flipAnim.direction === 'forward' ? 1 : -1,
          ['--active-page' as any]: flipAnim.activePageIndex ?? -1,
          ['--drag-x' as any]: flipAnim.dragX,
          ['--drag-y' as any]: flipAnim.dragY,
        }}
        onFocus={() => actions.setFocused(true)}
        onBlur={() => actions.setFocused(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        tabIndex={0}
      >
        {/* Live region for screen reader announcements */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          Page {currentDisplayPage} of {maxDisplayPage}
        </div>

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
              pageNumbers={pageNumbers}
              showThumbnailsToggle={config.showThumbnails}
              showTOCToggle={config.showTOC && toc.length > 0}
              onDownload={handleDownload}
              // onPrint removed
              onShare={handleShare}
            />
          </div>

          {/* Main content area - Relative positioning for navigation buttons */}
          <div className="flex-1 flex min-h-0 overflow-hidden m-0 p-0 border-0 bg-white relative">
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
                className={`relative flex items-center justify-center w-full flex-1`}
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/images/flipbook/winter-background.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#ffffff",
                  cursor: state.zoomLevel > 1 ? panAndZoom.cursor : undefined,
                  height: 'calc(100% - 20px)'
                }}
                onClick={handleCoverClick}
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
                  // Handle double-tap to zoom
                  handleDoubleTap(e);
                  // Handle pan and zoom when zoomed in
                  if (state.zoomLevel > 1) {
                    panAndZoom.handleTouchStart(e);
                  }
                }}
                onTouchMove={(e) => {
                  // Handle pinch-to-zoom
                  if (e.touches.length === 2) {
                    e.preventDefault();
                    handlePinchZoom(e);
                  }
                }}
                onTouchEnd={handlePinchEnd}
              >
                {isClient && (
                  <div
                    className="flipbook-stage"
                    style={{
                      transform: `translate(${state.panOffset.x}px, ${state.panOffset.y}px) scale(${state.zoomLevel})`,
                      transformOrigin: 'center center',
                      transition: panAndZoom.isDragging ? 'none' : 'transform 0.2s ease-out',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* @ts-ignore - react-pageflip has complex typing */}
                    <HTMLFlipBook
                      width={config.width ?? 1200}
                      height={config.height ?? 1600}
                      size={config.size ?? 'stretch'}
                      minWidth={config.minWidth ?? 600}
                      maxWidth={config.maxWidth ?? 1200}
                      minHeight={config.minHeight ?? 800}
                      maxHeight={config.maxHeight ?? 1600}
                      maxShadowOpacity={0}
                      flippingTime={950} // Slower, more natural page turn timing
                      disableFlipByClick={state.needsStabilization || isOnCoverPage} // Disable click flipping when stabilizing or on cover
                      useMouseEvents={state.zoomLevel === 1 && !isTransitioning} // Disable mouse flipping when zoomed or transitioning
                      showCover={config.showCover ?? false}
                      startPage={initialPage}
                      usePortrait={isMobile}
                      mobileScrollSupport={isMobile}
                      className=""
                      ref={bookRef}
                      onFlip={handleFlip}
                      onChangeState={handleChangeState}
                    >
                      {pages.map((page, index) => (
                        <FlipbookPageComponent
                          key={page.id}
                          page={page}
                          index={index}
                          currentPage={state.currentPage}
                          preloadPages={config.preloadPages ?? 3}
                          flipbookId={flipbookId}
                          isActiveFlippingPage={flipAnim.active && flipAnim.activePageIndex === index}
                        />
                      ))}
                    </HTMLFlipBook>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating Navigation Corner Buttons - Positioned outside overflow container */}
          <div className="absolute inset-0 z-[60] pointer-events-none">
            {/* Left Arrow - Previous Page */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (state.currentPage > 0 && bookRef.current?.pageFlip) {
                  triggerFlipAnimation('backward');
                  const flipInstance = bookRef.current.pageFlip();
                  if (flipInstance?.flipPrev && typeof flipInstance.flipPrev === 'function') {
                    flipInstance.flipPrev();
                  } else {
                    actions.previousPage();
                  }
                }
              }}
              disabled={state.currentPage === 0}
              className={`
                pointer-events-auto absolute bottom-8 left-4 md:bottom-10 md:left-8
                w-14 h-14 md:w-16 md:h-16 rounded-full
                flex items-center justify-center
                bg-white hover:bg-gray-50 active:bg-gray-100
                text-gray-900
                transition-all duration-200
                shadow-[0_8px_30px_rgb(0,0,0,0.5)]
                backdrop-blur-sm
                touch-manipulation
                border-2 border-gray-900/30
                ${state.currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-110 active:scale-95'}
              `}
              style={{ zIndex: 60 }}
              aria-label="Previous page"
              title="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow - Next Page */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (state.currentPage < pages.length - 1 && bookRef.current?.pageFlip) {
                  triggerFlipAnimation('forward');
                  const flipInstance = bookRef.current.pageFlip();
                  if (flipInstance?.flipNext && typeof flipInstance.flipNext === 'function') {
                    flipInstance.flipNext();
                  } else {
                    actions.nextPage();
                  }
                }
              }}
              disabled={state.currentPage >= pages.length - 1}
              className={`
                pointer-events-auto absolute bottom-8 right-4 md:bottom-10 md:right-8
                w-14 h-14 md:w-16 md:h-16 rounded-full
                flex items-center justify-center
                bg-white hover:bg-gray-50 active:bg-gray-100
                text-gray-900
                transition-all duration-200
                shadow-[0_8px_30px_rgb(0,0,0,0.5)]
                backdrop-blur-sm
                touch-manipulation
                border-2 border-gray-900/30
                ${state.currentPage >= pages.length - 1 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-110 active:scale-95'}
              `}
              style={{ zIndex: 60 }}
              aria-label="Next page"
              title="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
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

      </>
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
  flipbookId?: string;
  isActiveFlippingPage?: boolean;
}

const FlipbookPageComponent = React.forwardRef<HTMLDivElement, FlipbookPageComponentProps>(
  ({ page, index, currentPage, preloadPages, flipbookId, isActiveFlippingPage = false }, ref) => {
    const [shouldLoad, setShouldLoad] = useState(() => Math.abs(index - currentPage) <= preloadPages);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;
    const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [hotspotsFetched, setHotspotsFetched] = useState<any[]>([]);

    // Track mouse position for drag detection
    const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
    const isDragging = useRef(false);

    // Lazy loading logic: render only pages within the preload range buffer
    useEffect(() => {
      const distance = Math.abs(index - currentPage);
      const shouldBeLoaded = distance <= preloadPages;

      if (!shouldLoad && shouldBeLoaded) {
        // Load this page when it enters range
        setShouldLoad(true);
      }
      // Don't unload pages that have already loaded for better UX
    }, [index, currentPage, preloadPages, shouldLoad]);

    const handleHotspotClick = (hotspot: any) => {
      console.log('Hotspot clicked:', hotspot);
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
        className={`flex items-center justify-center w-full h-full relative flipbook-page bg-white ${isActiveFlippingPage ? 'active-flipping-page' : ''}`}
        style={{ minHeight: 0, minWidth: 0 }}
        data-page-index={index}
      >
        {shouldLoad ? (
          <>
            <img
              src={page.src}
              alt={page.alt || `Page ${index + 1}`}
              className="w-auto h-auto transition-opacity duration-300"
              style={{
                width: 'auto',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: 'auto',
                pointerEvents: 'none',
                opacity: hasLoaded ? 1 : 0
              }}
              onLoad={() => {
                setHasLoaded(true);
                setImageError(false);
                // Measure natural image size for hotspot conversion
                const imgEl = (ref as React.RefObject<HTMLDivElement>)?.current?.querySelector('img');
                if (imgEl && (imgEl as HTMLImageElement).naturalWidth) {
                  const el = imgEl as HTMLImageElement;
                  setNaturalSize({ width: el.naturalWidth, height: el.naturalHeight });
                }
                // Hotspots are now preloaded at flipbook initialization, no need to lazy fetch
                // (see FeaturedFlipbook component)
              }}
              onError={() => {
                if (retryCount < MAX_RETRIES) {
                  // Retry with exponential backoff
                  setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    setImageError(false);
                  }, Math.pow(2, retryCount) * 500);
                } else {
                  setImageError(true);
                }
              }}
              loading="lazy"
            />
            {/* Loading skeleton while image loads */}
            {!hasLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" style={{ backgroundSize: '200% 100%' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              </div>
            )}
            {/* Error state with retry button */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm font-medium">Failed to load</p>
                  <p className="text-xs mb-3">Page {index + 1}</p>
                  {retryCount >= MAX_RETRIES && (
                    <button
                      onClick={() => {
                        setRetryCount(0);
                        setImageError(false);
                      }}
                      className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Page number badge (sync with API/DB pageNumber) */}
            {hasLoaded && (
              <div className="flipbook-page-number" aria-label={`Page ${page.pageNumber ?? index + 1}`}>
                {page.pageNumber ?? index + 1}
              </div>
            )}
            {/* Interaction layer: render hotspots immediately (data from DB), don't wait for image load */}
            <div
              className={`absolute inset-0 flipbook-hotspot-layer ${isActiveFlippingPage ? 'flipping' : ''}`}
              style={{ zIndex: isActiveFlippingPage ? 30 : 12, pointerEvents: 'auto' }}
            >
                <div className="relative w-full h-full">
                  {(() => {
                    const imgEl = (ref as React.RefObject<HTMLDivElement>)?.current?.querySelector('img') as HTMLImageElement;
                    const renderWidth = imgEl?.clientWidth || imgEl?.naturalWidth || 1200;
                    const renderHeight = imgEl?.clientHeight || imgEl?.naturalHeight || 1600;

                    // Normalize data hotspots to percent and cap z-index below active flip layer
                    const rawHotspots = (page.hotspots?.length ? page.hotspots : hotspotsFetched) || [];
                    const normalizedHotspots = rawHotspots
                      .filter((h: any) => h && (h.linkUrl || h.productSku))
                      .map((h: any, idx: number) => {
                        const isPercent = h.x <= 100 && h.y <= 100 && h.width <= 100 && h.height <= 100;
                        const xPct = isPercent ? h.x : (h.x / renderWidth) * 100;
                        const yPct = isPercent ? h.y : (h.y / renderHeight) * 100;
                        const wPct = isPercent ? h.width : (h.width / renderWidth) * 100;
                        const hPct = isPercent ? h.height : (h.height / renderHeight) * 100;
                        const hotspotZ = Math.min((h.zIndex ?? 0) + 8, 12);
                        return { ...h, x: xPct, y: yPct, width: wPct, height: hPct, _z: hotspotZ, _key: h.id || `hs-${idx}` };
                      });

                    return (
                      <>
                        {normalizedHotspots.map((hotspot: any) => {
                          // Preserve hotspot clicks even near corners; nav buttons are compact
                          const isInCorner = false;

                          return (
                            <button
                              key={hotspot._key}
                              type="button"
                              className={`flipbook-hotspot ${isActiveFlippingPage ? 'flipping' : ''} ${isInCorner ? 'defer' : ''}`}
                              style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y}%`,
                                width: `${hotspot.width}%`,
                                height: `${hotspot.height}%`,
                                zIndex: hotspot._z,
                              }}
                              title={isInCorner ? '' : (hotspot.label || hotspot.productSku || '')}
                              aria-label={isInCorner ? '' : `Product: ${hotspot.label || hotspot.productSku || 'View details'}`}
                              tabIndex={isInCorner ? -1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                // Immediate response - no drag detection needed for buttons
                                if (hotspot.linkUrl) {
                                  window.open(hotspot.linkUrl, '_blank', 'noopener,noreferrer');
                                } else if (hotspot.productSku) {
                                  const url = `/shop/${encodeURIComponent(hotspot.productSku)}`;
                                  window.open(url, '_blank', 'noopener,noreferrer');
                                }
                                return false;
                              }}
                            >
                              <span className="flipbook-hotspot-highlight" />
                            </button>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>
          </>
        ) : (
          // Placeholder for unloaded pages
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Page {index + 1}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

FlipbookPageComponent.displayName = 'FlipbookPageComponent';
