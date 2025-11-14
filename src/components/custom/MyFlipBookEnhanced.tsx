/**
 * MyFlipBook - Enhanced Version
 * Backward-compatible wrapper that uses the new EnhancedFlipBook component
 * while maintaining the same API as the original MyFlipBook
 */

"use client";

import { useEffect, useState } from "react";
import { EnhancedFlipBook } from "@/components/flipbook";
import type { FlipbookPage, TOCEntry } from "@/types/flipbook-types";

export default function MyFlipBookEnhanced() {
  const [pages, setPages] = useState<FlipbookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const res = await fetch("/api/flipbook/images");
        if (!res.ok) throw new Error("Failed to fetch images");
        let files = await res.json();
        
        // Sort files numerically by page number (e.g., 1.jpg, 2.jpg, 10.jpg)
        files = files.sort((a: string, b: string) => {
          const getNum = (name: string) => {
            const match = name.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };
          return getNum(a) - getNum(b);
        });
        
        // Convert to FlipbookPage format
        const flipbookPages: FlipbookPage[] = files.map((filename: string, index: number) => ({
          id: index + 1,
          src: `/images/flipbook/${filename}`,
          alt: `Catalog page ${index + 1}`,
          thumbnailSrc: `/images/flipbook/${filename}`, // Could use smaller thumbnails if available
        }));
        
        setPages(flipbookPages);
      } catch (err) {
        setError("Failed to load flipbook images");
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  // Sample Table of Contents
  // You can customize this or fetch it from an API
  const sampleTOC: TOCEntry[] = [
    { title: "Cover", pageIndex: 0 },
    { title: "Introduction", pageIndex: 1 },
    { title: "Tools & Equipment", pageIndex: 5 },
    { title: "Power Tools", pageIndex: 10 },
    { title: "Hand Tools", pageIndex: 25 },
    { title: "Safety Equipment", pageIndex: 40 },
    { title: "Accessories", pageIndex: 60 },
    { title: "Special Offers", pageIndex: 80 },
    { title: "Index", pageIndex: 160 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-gray-100 p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading flipbook...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-gray-100 p-4 text-red-600">
        {error}
      </div>
    );
  }
  
  if (!pages.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-gray-100 p-4">
        No flipbook images found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-100 p-4">
      <EnhancedFlipBook
        pages={pages}
        toc={sampleTOC}
        config={{
          width: 400,
          height: 550,
          minWidth: 315,
          maxWidth: 1000,
          minHeight: 400,
          maxHeight: 1536,
          size: 'stretch',
          maxShadowOpacity: 0.5,
          showCover: true, // Enable cover mode for realistic book behavior
          showPageNumbers: true,
          enableSpread: true,
          autoPlayOnMount: false,
          autoPlayInterval: 3000,
          showThumbnails: false, // Can be toggled by user
          showTOC: false, // Can be toggled by user
          enableZoom: true,
          enableFullscreen: true,
          enableKeyboard: true,
          enableURLSync: true,
          preloadPages: 3,
        }}
        onPageChange={(pageIndex) => {
          console.log('Page changed to:', pageIndex + 1);
        }}
      />
    </div>
  );
}
