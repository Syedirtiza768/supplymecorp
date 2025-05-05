"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

// Generate dummy catalog pages
const generateCatalogPages = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    image: `/placeholder.svg?height=800&width=600&text=Catalog Page ${i + 1}`,
  }))
}

export default function FlipBook() {
  const [pages] = useState(generateCatalogPages(12))
  const [currentPage, setCurrentPage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1))
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, pages.length])

  // Handle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? pages.length - 1 : prev - 1))
  }

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  return (
    <div className={`flip-book ${isFullscreen ? "fixed inset-0 z-50 bg-black p-4" : ""}`}>
      {/* Book container */}
      <div
        className={`relative mx-auto overflow-hidden rounded-lg border bg-white shadow-lg ${
          isFullscreen ? "h-full" : "aspect-[4/3] w-full max-w-4xl"
        }`}
      >
        {/* Page display */}
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={pages[currentPage].image || "/placeholder.svg"}
              alt={`Catalog page ${currentPage + 1}`}
              width={800}
              height={600}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Page navigation overlays */}
          <button
            className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize opacity-0 hover:bg-black/5"
            onClick={goToPrevPage}
            aria-label="Previous page"
          />
          <button
            className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize opacity-0 hover:bg-black/5"
            onClick={goToNextPage}
            aria-label="Next page"
          />

          {/* Page number indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-white">
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 ${isFullscreen ? "text-white" : ""}`}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevPage} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
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
  )
}

// Missing Minus and Plus components
function Minus({ className }: { className?: string }) {
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
    </svg>
  )
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
  )
}
