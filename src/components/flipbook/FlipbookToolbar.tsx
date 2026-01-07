/**
 * FlipbookToolbar Component
 * Provides navigation and control buttons for the flipbook
 */

import React, { useMemo, useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Grid3x3,
  List,
  ZoomIn,
  ZoomOut,
  Maximize,
} from 'lucide-react';
import type { FlipbookState, FlipbookActions } from '@/types/flipbook-types';

interface FlipbookToolbarProps {
  state: FlipbookState;
  actions: FlipbookActions;
  pageNumbers?: number[];
  showThumbnailsToggle?: boolean;
  showTOCToggle?: boolean;
  showDownload?: boolean;
  showShare?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export function FlipbookToolbar({
  state,
  actions,
  pageNumbers,
  showThumbnailsToggle = true,
  showTOCToggle = true,
  showDownload = true,
  showShare = true,
  onDownload,
  onShare,
  className = '',
}: FlipbookToolbarProps) {
  const isFirstPage = state.currentPage === 0;
  const isLastPage = state.currentPage === (pageNumbers?.length ?? state.totalPages) - 1;
  const [pageInput, setPageInput] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  // Smooth flipping animation for first/last page jumps
  const smoothFlipToPage = async (targetPageIndex: number) => {
    if (isFlipping) return; // Prevent concurrent flips
    
    setIsFlipping(true);
    const currentPage = state.currentPage;
    const step = targetPageIndex > currentPage ? 1 : -1;
    let nextPage = currentPage + step;

    // Animate page-by-page with smooth timing
    while ((step > 0 && nextPage <= targetPageIndex) || (step < 0 && nextPage >= targetPageIndex)) {
      await new Promise(resolve => setTimeout(resolve, 80)); // 80ms per page flip
      actions.goToPage(nextPage);
      nextPage += step;
    }
    
    setIsFlipping(false);
  };

  const pageNumberMap = useMemo(() => {
    if (!pageNumbers || pageNumbers.length === 0) return null;
    const map = new Map<number, number>();
    pageNumbers.forEach((num, idx) => map.set(num, idx));
    return map;
  }, [pageNumbers]);

  const displayCurrentPage = pageNumbers?.[state.currentPage] ?? state.currentPage + 1;
  const displayTotalPages = pageNumbers?.[pageNumbers.length - 1] ?? state.totalPages;

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput, 10);
    let targetIndex: number | null = null;

    console.log('[FlipbookToolbar] handlePageInputSubmit called', {
      pageInput,
      pageNum,
      pageNumbersLength: pageNumbers?.length,
      hasPageNumberMap: !!pageNumberMap,
      totalPages: state.totalPages,
    });

    if (!isNaN(pageNum)) {
      if (pageNumberMap && pageNumbers && pageNumbers.length > 0) {
        if (pageNumberMap.has(pageNum)) {
          targetIndex = pageNumberMap.get(pageNum)!;
          console.log('[FlipbookToolbar] Found exact match', { pageNum, targetIndex });
        } else {
          const nextIndex = pageNumbers.findIndex((num) => num >= pageNum);
          targetIndex = nextIndex !== -1 ? nextIndex : pageNumbers.length - 1;
          console.log('[FlipbookToolbar] Using nearest match', { pageNum, nextIndex, targetIndex });
        }
      } else if (pageNum >= 1 && pageNum <= state.totalPages) {
        targetIndex = pageNum - 1; // Convert to 0-based index when we don't have explicit page numbers
        console.log('[FlipbookToolbar] Fallback to 0-based index', { pageNum, targetIndex });
      }
    }

    if (targetIndex !== null) {
      console.log('[FlipbookToolbar] Calling goToPage with index', targetIndex);
      actions.goToPage(targetIndex);
    } else {
      console.log('[FlipbookToolbar] No target index found, not navigating');
    }

    setPageInput('');
  };

  const handlePageInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    } else if (e.key === 'Escape') {
      setPageInput('');
    }
  };

  return (
    <div className={`bg-black text-white px-4 py-3 flex flex-wrap items-center justify-between gap-4 ${className}`}>
      {/* Left side - Navigation Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => smoothFlipToPage(0)}
          disabled={isFirstPage || isFlipping}
          aria-label="First page"
          title="First page (Home) - animated flip"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={actions.previousPage}
          disabled={isFirstPage}
          aria-label="Previous page"
          title="Previous page (Left arrow)"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page indicator with input */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">Page</span>
          <Input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            onBlur={handlePageInputSubmit}
            placeholder={String(displayCurrentPage)}
            className="w-14 h-8 px-2 text-center bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <span className="text-sm font-medium whitespace-nowrap">of {displayTotalPages}</span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={actions.nextPage}
          disabled={isLastPage}
          aria-label="Next page"
          title="Next page (Right arrow)"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => smoothFlipToPage(state.totalPages - 1)}
          disabled={isLastPage || isFlipping}
          aria-label="Last page"
          title="Last page (End) - animated flip"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        
        {/* Auto-play toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={actions.toggleAutoPlay}
          aria-label={state.isPlaying ? 'Pause auto-play' : 'Start auto-play'}
          title={state.isPlaying ? 'Pause' : 'Auto-play'}
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          {state.isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Center - Zoom Controls - HIDDEN per request */}
      {/* <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={actions.zoomOut}
          aria-label="Zoom out"
          title="Zoom out (-)"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
          {Math.round(state.zoomLevel * 100)}%
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={actions.zoomIn}
          aria-label="Zoom in"
          title="Zoom in (+)"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={actions.resetZoom}
          disabled={state.zoomLevel === 1}
          aria-label="Reset zoom"
          title="Reset zoom (0)"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div> */}

      {/* Right side - View and Action Controls */}
      <div className="flex items-center gap-2">
        {showThumbnailsToggle && (
          <Button
            variant={state.showThumbnails ? 'default' : 'outline'}
            size="icon"
            onClick={actions.toggleThumbnails}
            aria-label="Toggle thumbnails"
            title="Show thumbnails"
            className={state.showThumbnails ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white'}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        )}
        
        {showTOCToggle && (
          <Button
            variant={state.showTOC ? 'default' : 'outline'}
            size="icon"
            onClick={actions.toggleTOC}
            aria-label="Toggle table of contents"
            title="Table of contents"
            className={state.showTOC ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white'}
          >
            <List className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={actions.toggleFullscreen}
          aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={state.isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'}
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          {state.isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        
        {/* {showDownload && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            aria-label="Download catalog"
            title="Download"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" />
          </Button>
        )} */}
        
        {showShare && (
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            aria-label="Share catalog"
            title="Share"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
