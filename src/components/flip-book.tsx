"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
  Printer,
} from "lucide-react";
import { fetchFeaturedProducts } from "@/lib/products";

export default function FlipBook() {
  const [productPages, setProductPages] = useState<{id: string; html: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const res = await fetch("/api/flipbook/images");
        if (!res.ok) throw new Error("Failed to fetch images");
        const files = await res.json();
  const pages = (files as string[]).map((filename: string, i: number) => ({
          id: `page-${i + 1}`,
          html: `
            <div style='width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;'>
              <img src='/images/flipbook/${filename}' alt='Page ${i + 1}' style='max-width:80%;max-height:350px;object-fit:contain;border-radius:12px;border:1px solid #eee;margin-bottom:24px;' />
              <h2 style='font-size:2rem;font-weight:bold;margin-bottom:8px;text-align:center;'>Page ${i + 1}</h2>
            </div>
          `
        }));
        setProductPages(pages);
      } catch (err) {
  setError("Failed to load product pages");
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPlaying && productPages.length > 0) {
      interval = setInterval(() => {
        setCurrentPage((prev) => (prev === productPages.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, productPages.length]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const goToNextPage = () => setCurrentPage((prev) => (prev === productPages.length - 1 ? 0 : prev + 1));
  const goToPrevPage = () => setCurrentPage((prev) => (prev === 0 ? productPages.length - 1 : prev - 1));
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-xl">Loading catalog...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-96 text-xl text-red-600">{error}</div>;
  }

  if (!productPages.length) {
    return <div className="flex justify-center items-center h-96 text-xl">No products found.</div>;
  }

  return (
    <div className={`flip-book ${isFullscreen ? "fixed inset-0 z-50 bg-black p-4" : ""}`}>
      <div className={`relative mx-auto overflow-hidden rounded-lg border bg-white shadow-lg ${isFullscreen ? "h-full" : "aspect-[4/3] w-full max-w-4xl"}`}>
        <div className="relative h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300" style={{ transform: `scale(${zoomLevel})` }}>
            {/* Render HTML for current product page */}
            <div dangerouslySetInnerHTML={{ __html: productPages[currentPage]?.html }} style={{ width: "100%", height: "100%" }} />
          </div>
          <button className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize opacity-0 hover:bg-black/5" onClick={goToPrevPage} aria-label="Previous page" />
          <button className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize opacity-0 hover:bg-black/5" onClick={goToNextPage} aria-label="Next page" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-white">
            Page {currentPage + 1} of {productPages.length}
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 ${isFullscreen ? "text-white" : ""}`}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevPage} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextPage} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut} aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-16 text-center text-sm">{Math.round(zoomLevel * 100)}%</span>
          <Button variant="outline" size="icon" onClick={zoomIn} aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" aria-label="Print catalog">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Download catalog">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Share catalog">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Icon components for zoom controls
function Minus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
// ...existing code...
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
      stroke="currentColor"
