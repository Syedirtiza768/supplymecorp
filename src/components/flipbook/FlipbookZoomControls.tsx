/**
 * FlipbookZoomControls Component
 * Provides zoom in/out/reset controls with visual zoom level indicator
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { FlipbookState, FlipbookActions } from '@/types/flipbook-types';

interface FlipbookZoomControlsProps {
  state: FlipbookState;
  actions: FlipbookActions;
  className?: string;
  showPercentage?: boolean;
}

export function FlipbookZoomControls({
  state,
  actions,
  className = '',
  showPercentage = true,
}: FlipbookZoomControlsProps) {
  const minZoom = 0.5;
  const maxZoom = 3;
  const canZoomOut = state.zoomLevel > minZoom;
  const canZoomIn = state.zoomLevel < maxZoom;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={actions.zoomOut}
        disabled={!canZoomOut}
        aria-label="Zoom out"
        title="Zoom out (-)"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      {showPercentage && (
        <div className="px-2 py-1 text-sm font-medium min-w-[60px] text-center">
          {Math.round(state.zoomLevel * 100)}%
        </div>
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={actions.zoomIn}
        disabled={!canZoomIn}
        aria-label="Zoom in"
        title="Zoom in (+)"
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
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Hook to handle pan/drag when zoomed
 */
interface UsePanAndZoomProps {
  zoomLevel: number;
  panOffset: { x: number; y: number };
  setPanOffset: (offset: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function usePanAndZoom({
  zoomLevel,
  panOffset,
  setPanOffset,
  containerRef,
}: UsePanAndZoomProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomLevel > 1 && !e.defaultPrevented) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        e.preventDefault();
      }
    },
    [zoomLevel, panOffset]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoomLevel > 1) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain pan offset to prevent over-panning
        const maxPanX = containerRef.current ? (containerRef.current.offsetWidth * (zoomLevel - 1)) / 2 : 100;
        const maxPanY = containerRef.current ? (containerRef.current.offsetHeight * (zoomLevel - 1)) / 2 : 100;
        
        setPanOffset({
          x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
        });
      }
    },
    [isDragging, zoomLevel, dragStart, containerRef, setPanOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoomLevel > 1 && e.touches.length === 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    },
    [zoomLevel, panOffset]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;
        
        const maxPanX = containerRef.current ? (containerRef.current.offsetWidth * (zoomLevel - 1)) / 2 : 100;
        const maxPanY = containerRef.current ? (containerRef.current.offsetHeight * (zoomLevel - 1)) / 2 : 100;
        
        setPanOffset({
          x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
        });
      }
    },
    [isDragging, zoomLevel, dragStart, containerRef, setPanOffset]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Reset pan when zoom is reset to 1
  useEffect(() => {
    if (zoomLevel === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoomLevel, setPanOffset]);

  // Reset dragging state when user navigates away (e.g., clicking hotspot)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsDragging(false);
      }
    };

    const handleBlur = () => {
      setIsDragging(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };
}
