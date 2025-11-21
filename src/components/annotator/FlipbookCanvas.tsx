"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { Rnd } from "react-rnd";
import { HotspotInput } from "@/lib/flipbooks";
import { cn } from "@/lib/utils";

interface FlipbookCanvasProps {
  imageUrl: string;
  hotspots: HotspotInput[];
  selectedId: string | null;
  zoom: number;
  previewMode: boolean;
  onHotspotsChange: (hotspots: HotspotInput[]) => void;
  onSelectHotspot: (id: string | null) => void;
}

export function FlipbookCanvas({
  imageUrl,
  hotspots,
  selectedId,
  zoom,
  previewMode,
  onHotspotsChange,
  onSelectHotspot,
}: FlipbookCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawRect, setDrawRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Track image dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const img = containerRef.current?.querySelector("img");
        if (img) {
          setImageDimensions({ width: img.clientWidth, height: img.clientHeight });
        }
      };
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [imageUrl]);

  const percentToPx = (percent: number, dimension: number) => (percent / 100) * dimension;
  const pxToPercent = (px: number, dimension: number) => (px / dimension) * 100;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (previewMode || (e.target as HTMLElement).closest(".rnd-hotspot")) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawRect({ x, y, width: 0, height: 0 });
    onSelectHotspot(null);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - drawStart.x;
    const height = currentY - drawStart.y;

    const normalized = {
      x: width < 0 ? currentX : drawStart.x,
      y: height < 0 ? currentY : drawStart.y,
      width: Math.abs(width),
      height: Math.abs(height),
    };

    setDrawRect(normalized);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !drawRect || drawRect.width < 10 || drawRect.height < 10) {
      setIsDrawing(false);
      setDrawRect(null);
      return;
    }

    const newHotspot: HotspotInput = {
      id: `temp-${Date.now()}`,
      productSku: "",
      x: pxToPercent(drawRect.x, imageDimensions.width),
      y: pxToPercent(drawRect.y, imageDimensions.height),
      width: pxToPercent(drawRect.width, imageDimensions.width),
      height: pxToPercent(drawRect.height, imageDimensions.height),
      zIndex: hotspots.length,
    };

    onHotspotsChange([...hotspots, newHotspot]);
    onSelectHotspot(newHotspot.id!);

    setIsDrawing(false);
    setDrawRect(null);
    setDrawStart(null);
  };

  const handleHotspotUpdate = (id: string, x: number, y: number, width: number, height: number) => {
    const updated = hotspots.map((h) =>
      h.id === id
        ? {
            ...h,
            x: pxToPercent(x, imageDimensions.width),
            y: pxToPercent(y, imageDimensions.height),
            width: pxToPercent(width, imageDimensions.width),
            height: pxToPercent(height, imageDimensions.height),
          }
        : h
    );
    onHotspotsChange(updated);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Image
        src={imageUrl}
        alt="Flipbook page"
        width={1200}
        height={1600}
        className="max-w-full h-auto pointer-events-none"
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          setImageDimensions({ width: img.clientWidth, height: img.clientHeight });
        }}
      />

      {!previewMode && hotspots.map((hotspot) => {
        const isSelected = hotspot.id === selectedId;
        return (
          <Rnd
            key={hotspot.id}
            className={cn(
              "rnd-hotspot border-2 box-border cursor-move",
              isSelected ? "border-blue-500 bg-blue-500/20" : "border-amber-500 bg-amber-500/10"
            )}
            position={{
              x: percentToPx(hotspot.x, imageDimensions.width),
              y: percentToPx(hotspot.y, imageDimensions.height),
            }}
            size={{
              width: percentToPx(hotspot.width, imageDimensions.width),
              height: percentToPx(hotspot.height, imageDimensions.height),
            }}
            onDragStop={(e, d) => {
              handleHotspotUpdate(
                hotspot.id!,
                d.x,
                d.y,
                percentToPx(hotspot.width, imageDimensions.width),
                percentToPx(hotspot.height, imageDimensions.height)
              );
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleHotspotUpdate(
                hotspot.id!,
                position.x,
                position.y,
                ref.offsetWidth,
                ref.offsetHeight
              );
            }}
            bounds="parent"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onSelectHotspot(hotspot.id!);
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-white">
              {hotspot.label || hotspot.productSku || "New"}
            </div>
          </Rnd>
        );
      })}

      {drawRect && (
        <div
          className="absolute border-2 border-emerald-500 bg-emerald-500/20 pointer-events-none"
          style={{
            left: drawRect.x,
            top: drawRect.y,
            width: drawRect.width,
            height: drawRect.height,
          }}
        />
      )}
    </div>
  );
}
