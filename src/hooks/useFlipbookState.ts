/**
 * Custom hook for managing flipbook state and actions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FlipbookState, FlipbookActions, FlipbookConfig } from '@/types/flipbook-types';

interface UseFlipbookStateProps {
  totalPages: number;
  initialPage?: number;
  config?: FlipbookConfig;
  onPageChange?: (pageIndex: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onZoomChange?: (zoomLevel: number) => void;
}

export function useFlipbookState({
  totalPages,
  initialPage = 0,
  config = {},
  onPageChange,
  onFullscreenChange,
  onZoomChange,
}: UseFlipbookStateProps): [FlipbookState, FlipbookActions] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize current page from URL if enableURLSync is true
  const getInitialPage = useCallback(() => {
    if (config.enableURLSync && searchParams) {
      const pageParam = searchParams.get('page');
      if (pageParam) {
        const pageNum = parseInt(pageParam, 10);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
          return pageNum - 1; // Convert to 0-based
        }
      }
    }
    return initialPage;
  }, [config.enableURLSync, searchParams, initialPage, totalPages]);

  const [state, setState] = useState<FlipbookState>(() => ({
    currentPage: getInitialPage(),
    totalPages,
    isPlaying: config.autoPlayOnMount ?? false,
    isFullscreen: false,
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    showThumbnails: config.showThumbnails ?? false,
    showTOC: false,
    isLoading: false,
    error: null,
    isFocused: false,
    needsStabilization: false,
  }));

  // Re-sync from URL on mount (handles direct URL navigation)
  useEffect(() => {
    const urlPage = getInitialPage();
    if (urlPage !== state.currentPage) {
      setState((prev) => ({ ...prev, currentPage: urlPage }));
    }
  }, []);

  // Update URL when page changes (if enableURLSync is true)
  useEffect(() => {
    if (config.enableURLSync && typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('page', String(state.currentPage + 1)); // Convert to 1-based
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [state.currentPage, config.enableURLSync]);

  // Auto-play effect
  useEffect(() => {
    if (state.isPlaying) {
      const interval = config.autoPlayInterval ?? 3000;
      autoPlayTimerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          currentPage: prev.currentPage >= prev.totalPages - 1 ? 0 : prev.currentPage + 1,
        }));
      }, interval);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [state.isPlaying, config.autoPlayInterval]);

  // Trigger callback when page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(state.currentPage);
    }
  }, [state.currentPage, onPageChange]);

  // Trigger callback when fullscreen changes
  useEffect(() => {
    if (onFullscreenChange) {
      onFullscreenChange(state.isFullscreen);
    }
  }, [state.isFullscreen, onFullscreenChange]);

  // Trigger callback when zoom changes
  useEffect(() => {
    if (onZoomChange) {
      onZoomChange(state.zoomLevel);
    }
  }, [state.zoomLevel, onZoomChange]);

  // Handle browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setState((prev) => ({ ...prev, isFullscreen: isCurrentlyFullscreen }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Mark flipbook for stabilization when user leaves page (e.g., clicking hotspot link)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page - mark for stabilization on return
        setState((prev) => ({ ...prev, needsStabilization: true }));
      }
    };

    const handleBlur = () => {
      // Window lost focus - mark for stabilization
      setState((prev) => ({ ...prev, needsStabilization: true }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const actions: FlipbookActions = {
    goToPage: useCallback((pageIndex: number) => {
      console.log('[useFlipbookState] goToPage called', { pageIndex, totalPages });
      if (pageIndex >= 0 && pageIndex < totalPages) {
        console.log('[useFlipbookState] Setting currentPage to', pageIndex);
        setState((prev) => ({ ...prev, currentPage: pageIndex }));
      } else {
        console.log('[useFlipbookState] pageIndex out of bounds', { pageIndex, totalPages });
      }
    }, [totalPages]),

    nextPage: useCallback(() => {
      setState((prev) => ({
        ...prev,
        currentPage: Math.min(prev.currentPage + 1, prev.totalPages - 1),
      }));
    }, []),

    previousPage: useCallback(() => {
      setState((prev) => ({
        ...prev,
        currentPage: Math.max(prev.currentPage - 1, 0),
      }));
    }, []),

    firstPage: useCallback(() => {
      setState((prev) => ({ ...prev, currentPage: 0 }));
    }, []),

    lastPage: useCallback(() => {
      setState((prev) => ({ ...prev, currentPage: prev.totalPages - 1 }));
    }, []),

    toggleAutoPlay: useCallback(() => {
      setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }, []),

    toggleFullscreen: useCallback(async () => {
      if (!document.fullscreenElement) {
        const elem = document.getElementById('flipbook-container');
        if (elem?.requestFullscreen) {
          try {
            await elem.requestFullscreen();
            setState((prev) => ({ ...prev, isFullscreen: true }));
          } catch (err) {
            console.error('Error attempting to enable fullscreen:', err);
          }
        }
      } else {
        if (document.exitFullscreen) {
          try {
            await document.exitFullscreen();
            setState((prev) => ({ ...prev, isFullscreen: false }));
          } catch (err) {
            console.error('Error attempting to exit fullscreen:', err);
          }
        }
      }
    }, []),

    setZoom: useCallback((level: number) => {
      const clampedLevel = Math.max(0.5, Math.min(3, level));
      setState((prev) => ({ ...prev, zoomLevel: clampedLevel }));
    }, []),

    zoomIn: useCallback(() => {
      setState((prev) => ({
        ...prev,
        zoomLevel: Math.min(prev.zoomLevel + 0.25, 3),
      }));
    }, []),

    zoomOut: useCallback(() => {
      setState((prev) => ({
        ...prev,
        zoomLevel: Math.max(prev.zoomLevel - 0.25, 0.5),
      }));
    }, []),

    resetZoom: useCallback(() => {
      setState((prev) => ({ ...prev, zoomLevel: 1, panOffset: { x: 0, y: 0 } }));
    }, []),

    setPanOffset: useCallback((offset: { x: number; y: number }) => {
      setState((prev) => ({ ...prev, panOffset: offset }));
    }, []),

    toggleThumbnails: useCallback(() => {
      setState((prev) => ({ ...prev, showThumbnails: !prev.showThumbnails }));
    }, []),

    toggleTOC: useCallback(() => {
      setState((prev) => ({ ...prev, showTOC: !prev.showTOC }));
    }, []),

    setFocused: useCallback((focused: boolean) => {
      setState((prev) => ({ ...prev, isFocused: focused }));
    }, []),

    stabilize: useCallback(() => {
      setState((prev) => ({ ...prev, needsStabilization: false }));
    }, []),
  };

  return [state, actions];
}
