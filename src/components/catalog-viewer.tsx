"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Mail, Pause, Play, Volume2, VolumeX } from "lucide-react"

export default function CatalogViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(12)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1))
  }

  const toggleAutoPlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const toggleSound = () => {
    setIsMuted((prev) => !prev)
  }

  const shareCatalog = () => {
    if (typeof window !== "undefined") {
      window.open(
        `mailto:?subject=Check out the RR General Supply Catalog&body=View our latest catalog at: ${window.location.href}`,
        "_blank",
      )
    }
  }

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextPage()
      }, 3000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`/placeholder.svg?height=600&width=800&text=Catalog Page ${currentPage}`}
            alt={`Catalog page ${currentPage}`}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-white">
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevPage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleAutoPlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={nextPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleSound}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={shareCatalog}>
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
