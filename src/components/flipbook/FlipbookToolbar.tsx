/**
 * FlipbookToolbar Component
 * Provides navigation and control buttons for the flipbook
 */

import React from 'react';
import { Button } from '@/components/ui/button';
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
  Printer,
  Share2,
  Grid3x3,
  List,
} from 'lucide-react';
import type { FlipbookState, FlipbookActions } from '@/types/flipbook-types';

interface FlipbookToolbarProps {
  state: FlipbookState;
  actions: FlipbookActions;
  showThumbnailsToggle?: boolean;
  showTOCToggle?: boolean;
  showDownload?: boolean;
  showPrint?: boolean;
  showShare?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  className?: string;
}

export function FlipbookToolbar({
  state,
  actions,
  showThumbnailsToggle = true,
  showTOCToggle = true,
  showDownload = true,
  showPrint = true,
  showShare = true,
  onDownload,
  onPrint,
  onShare,
  className = '',
}: FlipbookToolbarProps) {
  const isFirstPage = state.currentPage === 0;
  const isLastPage = state.currentPage === state.totalPages - 1;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={actions.firstPage}
          disabled={isFirstPage}
          aria-label="First page"
          title="First page (Home)"
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
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page indicator */}
        <div className="px-3 py-1 text-sm font-medium min-w-[100px] text-center">
          {state.currentPage + 1} / {state.totalPages}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={actions.nextPage}
          disabled={isLastPage}
          aria-label="Next page"
          title="Next page (Right arrow)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={actions.lastPage}
          disabled={isLastPage}
          aria-label="Last page"
          title="Last page (End)"
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
        >
          {state.isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-1">
        {showThumbnailsToggle && (
          <Button
            variant={state.showThumbnails ? 'default' : 'outline'}
            size="icon"
            onClick={actions.toggleThumbnails}
            aria-label="Toggle thumbnails"
            title="Show thumbnails"
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
        >
          {state.isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        {showPrint && (
          <Button
            variant="outline"
            size="icon"
            onClick={onPrint}
            aria-label="Print catalog"
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>
        )}
        
        {showDownload && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            aria-label="Download catalog"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        
        {showShare && (
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            aria-label="Share catalog"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
