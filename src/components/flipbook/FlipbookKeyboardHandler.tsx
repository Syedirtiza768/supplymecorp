
"use client";
/**
 * FlipbookKeyboardHandler Component
 * Handles keyboard navigation for the flipbook
 */

import { useEffect } from 'react';
import type { FlipbookActions } from '@/types/flipbook-types';

interface FlipbookKeyboardHandlerProps {
  actions: FlipbookActions;
  enabled: boolean;
  isFocused: boolean;
}

export function FlipbookKeyboardHandler({
  actions,
  enabled,
  isFocused,
}: FlipbookKeyboardHandlerProps) {
  useEffect(() => {
    if (!enabled || !isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          actions.previousPage();
          break;
        
        case 'ArrowRight':
        case 'PageDown':
        case ' ': // Space bar
          e.preventDefault();
          actions.nextPage();
          break;
        
        case 'Home':
          e.preventDefault();
          actions.firstPage();
          break;
        
        case 'End':
          e.preventDefault();
          actions.lastPage();
          break;
        
        case 'f':
        case 'F':
          // Only trigger fullscreen if not holding Ctrl/Cmd (to avoid browser fullscreen conflict)
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            actions.toggleFullscreen();
          }
          break;
        
        case 'Escape':
          e.preventDefault();
          // Exit fullscreen or close panels
          if (document.fullscreenElement) {
            actions.toggleFullscreen();
          }
          break;
        
        case '+':
        case '=':
          e.preventDefault();
          actions.zoomIn();
          break;
        
        case '-':
        case '_':
          e.preventDefault();
          actions.zoomOut();
          break;
        
        case '0':
          e.preventDefault();
          actions.resetZoom();
          break;
        
        case 't':
        case 'T':
          e.preventDefault();
          actions.toggleThumbnails();
          break;
        
        case 'c':
        case 'C':
          e.preventDefault();
          actions.toggleTOC();
          break;
        
        case 'p':
        case 'P':
          // Only toggle autoplay if not holding Ctrl/Cmd (to avoid print conflict)
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            actions.toggleAutoPlay();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, isFocused, actions]);

  // This component doesn't render anything
  return null;
}

/**
 * Keyboard shortcuts reference component
 */
export function KeyboardShortcutsHelp() {
  return (
    <div className="text-sm space-y-2">
      <h4 className="font-semibold mb-3">Keyboard Shortcuts</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <kbd className="font-mono text-xs">←/→</kbd>
        <span className="text-muted-foreground">Previous/Next page</span>
        
        <kbd className="font-mono text-xs">Home/End</kbd>
        <span className="text-muted-foreground">First/Last page</span>
        
        <kbd className="font-mono text-xs">Space</kbd>
        <span className="text-muted-foreground">Next page</span>
        
        <kbd className="font-mono text-xs">F</kbd>
        <span className="text-muted-foreground">Toggle fullscreen</span>
        
        <kbd className="font-mono text-xs">+/-</kbd>
        <span className="text-muted-foreground">Zoom in/out</span>
        
        <kbd className="font-mono text-xs">0</kbd>
        <span className="text-muted-foreground">Reset zoom</span>
        
        <kbd className="font-mono text-xs">T</kbd>
        <span className="text-muted-foreground">Toggle thumbnails</span>
        
        <kbd className="font-mono text-xs">C</kbd>
        <span className="text-muted-foreground">Toggle contents</span>
        
        <kbd className="font-mono text-xs">P</kbd>
        <span className="text-muted-foreground">Toggle auto-play</span>
        
        <kbd className="font-mono text-xs">Esc</kbd>
        <span className="text-muted-foreground">Exit fullscreen</span>
      </div>
    </div>
  );
}
