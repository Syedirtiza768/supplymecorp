"use client";

import { useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import { Hotspot } from "@/lib/hotspots";
import { cn } from "@/lib/utils";

type Rect = { x: number; y: number; width: number; height: number };

interface CanvasHotspotLayerProps {
  pageImageUrl: string;
  hotspots: Hotspot[];
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
  onCreateHotspot: (rect: Rect) => void;
}

export function CanvasHotspotLayer({
  pageImageUrl,
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  onCreateHotspot,
}: CanvasHotspotLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);

  function getRelativeCoords(e: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).dataset.hotspot) return;

    const { x, y } = getRelativeCoords(e);
    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentRect({ x, y, width: 0, height: 0 });
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!isDrawing || !startPoint) return;
    const { x, y } = getRelativeCoords(e);

    const width = x - startPoint.x;
    const height = y - startPoint.y;

    const normalized: Rect = {
      x: width < 0 ? x : startPoint.x,
      y: height < 0 ? y : startPoint.y,
      width: Math.abs(width),
      height: Math.abs(height),
    };

    setCurrentRect(normalized);
  }

  function handleMouseUp() {
    if (!isDrawing || !currentRect) {
      setIsDrawing(false);
      setCurrentRect(null);
      return;
    }

    setIsDrawing(false);

    if (currentRect.width > 5 && currentRect.height > 5) {
      onCreateHotspot(currentRect);
    }

    setCurrentRect(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto border rounded-lg overflow-hidden bg-muted"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Image
        src={pageImageUrl}
        alt="Flipbook page"
        width={1200}
        height={1600}
        className="w-full h-auto select-none pointer-events-none"
      />

      {hotspots.map((hs) => (
        <div
          key={hs.id}
          data-hotspot="true"
          className={cn(
            "absolute border-2 box-border cursor-pointer",
            selectedHotspotId === hs.id
              ? "border-blue-500 bg-blue-500/10"
              : "border-amber-500 bg-amber-500/10"
          )}
          style={{
            left: hs.x,
            top: hs.y,
            width: hs.width,
            height: hs.height,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectHotspot(hs.id);
          }}
        />
      ))}

      {currentRect && (
        <div
          className="absolute border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none"
          style={{
            left: currentRect.x,
            top: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
          }}
        />
      )}
    </div>
  );
}
