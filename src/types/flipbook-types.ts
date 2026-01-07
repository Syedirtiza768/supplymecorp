/**
 * TypeScript type definitions for the Enhanced Flipbook feature
 */

export interface FlipbookPage {
  /** Unique identifier for the page */
  id: string | number;
  /** Source URL of the page image */
  src: string;
  /** Original 1-based page number from the API (if available) */
  pageNumber?: number;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional title for cover/title pages */
  title?: string;
  /** Optional thumbnail source (lower resolution) */
  thumbnailSrc?: string;
  /** Whether the page has been loaded */
  loaded?: boolean;
  /** Optional hotspots for interactive areas */
  hotspots?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
    productSku?: string;
    linkUrl?: string;
    zIndex?: number;
  }>;
}

export interface TOCEntry {
  /** Display title for the TOC entry */
  title: string;
  /** Page index (0-based) this entry points to */
  pageIndex: number;
  /** Optional nested sub-entries */
  children?: TOCEntry[];
}

export interface FlipbookConfig {
  /** Width of the flipbook pages (in pixels) */
  width?: number;
  /** Height of the flipbook pages (in pixels) */
  height?: number;
  /** Minimum width for responsive sizing */
  minWidth?: number;
  /** Maximum width for responsive sizing */
  maxWidth?: number;
  /** Minimum height for responsive sizing */
  minHeight?: number;
  /** Maximum height for responsive sizing */
  maxHeight?: number;
  /** Whether to show cover page differently */
  showCover?: boolean;
  /** Size mode: 'fixed' | 'stretch' */
  size?: 'fixed' | 'stretch';
  /** Maximum shadow opacity (0-1) */
  maxShadowOpacity?: number;
  /** Show page numbers */
  showPageNumbers?: boolean;
  /** Enable two-page spread on larger screens */
  enableSpread?: boolean;
  /** Enable auto-play on mount */
  autoPlayOnMount?: boolean;
  /** Auto-play interval in milliseconds */
  autoPlayInterval?: number;
  /** Enable thumbnails */
  showThumbnails?: boolean;
  /** Enable table of contents */
  showTOC?: boolean;
  /** Enable zoom controls */
  enableZoom?: boolean;
  /** Enable fullscreen */
  enableFullscreen?: boolean;
  /** Enable keyboard navigation */
  enableKeyboard?: boolean;
  /** Enable URL sync for deep linking */
  enableURLSync?: boolean;
  /** Number of pages to preload ahead/behind current page */
  preloadPages?: number;
  /** Custom CSS class for the container */
  className?: string;
  /** Duration of page flip animation in ms */
  flippingTime?: number;
}

export interface FlipbookState {
  /** Current page index (0-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether auto-play is active */
  isPlaying: boolean;
  /** Whether in fullscreen mode */
  isFullscreen: boolean;
  /** Current zoom level (1 = 100%) */
  zoomLevel: number;
  /** Pan offset when zoomed */
  panOffset: { x: number; y: number };
  /** Whether thumbnails panel is visible */
  showThumbnails: boolean;
  /** Whether TOC panel is visible */
  showTOC: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the flipbook is focused (for keyboard nav) */
  isFocused: boolean;
  /** Whether the flipbook needs stabilization (first click will be consumed) */
  needsStabilization: boolean;
}

export interface FlipbookActions {
  /** Navigate to a specific page */
  goToPage: (pageIndex: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Toggle auto-play */
  toggleAutoPlay: () => void;
  /** Set flipbook reference for animated flips during auto-play */
  setFlipbookRef: (ref: any) => void;
  /** Toggle fullscreen */
  toggleFullscreen: () => void;
  /** Set zoom level */
  setZoom: (level: number) => void;
  /** Zoom in */
  zoomIn: () => void;
  /** Zoom out */
  zoomOut: () => void;
  /** Reset zoom */
  resetZoom: () => void;
  /** Set pan offset */
  setPanOffset: (offset: { x: number; y: number }) => void;
  /** Toggle thumbnails panel */
  toggleThumbnails: () => void;
  /** Toggle TOC panel */
  toggleTOC: () => void;
  /** Set focus state */
  setFocused: (focused: boolean) => void;
  /** Mark flipbook as stabilized (consume first click) */
  stabilize: () => void;
}

export interface EnhancedFlipBookProps {
  /** Array of pages to display */
  pages?: FlipbookPage[];
  /** Configuration options */
  config?: FlipbookConfig;
  /** Table of contents data */
  toc?: TOCEntry[];
  /** Initial page to display (0-based) */
  initialPage?: number;
  /** Callback when page changes */
  onPageChange?: (pageIndex: number) => void;
  /** Callback when flipbook enters/exits fullscreen */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** Callback when zoom level changes */
  onZoomChange?: (zoomLevel: number) => void;
  /** Callback when flipbook is mounted and ready */
  onMount?: () => void;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Custom CSS class */
  className?: string;
}

export interface FlipbookRef {
  /** Get current page index */
  getCurrentPage: () => number;
  /** Navigate to specific page */
  goToPage: (pageIndex: number) => void;
  /** Enter fullscreen */
  enterFullscreen: () => void;
  /** Exit fullscreen */
  exitFullscreen: () => void;
  /** Toggle fullscreen */
  toggleFullscreen: () => void;
}
