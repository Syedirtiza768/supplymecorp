"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Edit } from "lucide-react";

interface FlipbookPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
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

interface FlipbookPreviewModalProps {
  flipbookId: string;
  open: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

export function FlipbookPreviewModal({
  flipbookId,
  open,
  onClose,
}: FlipbookPreviewModalProps) {
  const router = useRouter();
  const [pages, setPages] = useState<FlipbookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadPages();
    }
  }, [open, flipbookId]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/flipbooks/${flipbookId}/pages`, {
        headers: { Authorization: AUTH_HEADER },
      });
      if (!res.ok) throw new Error("Failed to load pages");
      const data = await res.json();
      setPages(data.sort((a: FlipbookPage, b: FlipbookPage) => a.pageNumber - b.pageNumber));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentPage = pages[currentPageIndex];
  const goToNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleAnnotate = () => {
    if (currentPage) {
      router.push(`/admin/flipbooks/${flipbookId}/pages/${currentPage.pageNumber}/annotate`);
      onClose();
    }
  };

  const handleHotspotClick = (hotspot: any) => {
    console.log('Hotspot clicked:', hotspot);
    if (hotspot.linkUrl) {
      if (hotspot.linkUrl.startsWith('http')) {
        window.open(hotspot.linkUrl, '_blank');
      } else {
        router.push(hotspot.linkUrl);
      }
    } else if (hotspot.productSku) {
      router.push(`/shop?search=${encodeURIComponent(hotspot.productSku)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        {/* Accessibility: DialogTitle required for screen readers */}
        <span className="sr-only">
          <DialogTitle>Flipbook Preview</DialogTitle>
        </span>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-muted-foreground">No pages found</p>
            <Button onClick={() => router.push(`/admin/flipbooks/${flipbookId}/pages/upload`)}>
              Upload Pages
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold">
                  Page {currentPage?.pageNumber} of {pages.length}
                </h3>
                {currentPage?.hotspots && (
                  <span className="text-sm text-muted-foreground">
                    {currentPage.hotspots.length} hotspot{currentPage.hotspots.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAnnotate}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Page
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 relative overflow-hidden bg-muted/20">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {currentPage && (
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={currentPage.imageUrl}
                      alt={`Page ${currentPage.pageNumber}`}
                      className="max-w-full max-h-full object-contain"
                    />
                    {/* Hotspot Overlays */}
                    {currentPage.hotspots?.map((hotspot) => (
                      <button
                        key={hotspot.id}
                        className="absolute border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/30 transition-colors group cursor-pointer"
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          width: `${hotspot.width}%`,
                          height: `${hotspot.height}%`,
                          zIndex: (hotspot.zIndex ?? 0) + 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotspotClick(hotspot);
                        }}
                        title={hotspot.label || hotspot.productSku || "Interactive area"}
                      >
                        {/* Tooltip */}
                        {(hotspot.label || hotspot.productSku) && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                            {hotspot.label || hotspot.productSku}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {currentPageIndex > 0 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              {currentPageIndex < pages.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPageIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  title={`Page ${page.pageNumber}`}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
