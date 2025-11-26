"use client";

import { useState, useEffect } from "react";
import { EnhancedFlipBook } from "@/components/flipbook/EnhancedFlipBook";
import type { FlipbookPage, TOCEntry } from "@/types/flipbook-types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

export function FeaturedFlipbook() {
    const [flipbook, setFlipbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedFlipbook();
  }, []);

  const loadFeaturedFlipbook = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/flipbooks/featured/current`, {
        headers: { Authorization: AUTH_HEADER },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFlipbook(data);
        }
      }
    } catch (error) {
      console.error("Failed to load featured flipbook:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotspotClick = (hotspot: any) => {
    if (hotspot.linkUrl) {
      if (hotspot.linkUrl.startsWith("http")) {
        window.open(hotspot.linkUrl, "_blank");
      } else {
          // router.push(hotspot.linkUrl); // Commented out as router is not defined
      }
    } else if (hotspot.productSku) {
        // router.push(`/shop?search=${encodeURIComponent(hotspot.productSku)}`); // Commented out as router is not defined
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Loading catalog...</p>
      </div>
    );
  }

  if (!flipbook || !flipbook.pages || flipbook.pages.length === 0) {
    return null; // Don't show anything if no featured flipbook
  }

  // Map API pages to EnhancedFlipBook format with hotspots
  const pages: FlipbookPage[] = flipbook.pages
    .sort((a: any, b: any) => a.pageNumber - b.pageNumber) // Ensure pages are sorted by pageNumber
    .map((page: any, index: number) => ({
      id: page.id,
      src: page.imageUrl,
      alt: index === 0 ? flipbook.description || `${flipbook.title}` : `Page ${page.pageNumber}`,
      title: index === 0 ? flipbook.title : undefined, // Add title to first page for centered display
      hotspots: page.hotspots || [],
      // Optionally add thumbnailSrc if available
      // thumbnailSrc: page.thumbnailUrl,
    }));

  // Optionally, build a TOC if your API provides it or you want to hardcode
  const toc: TOCEntry[] = [
    { title: "Cover", pageIndex: 0 },
    // Add more entries as needed
  ];

  return (
    <div className="flipbook-canvas-container">
      <EnhancedFlipBook
        pages={pages}
        toc={toc}
        flipbookId={flipbook.id}
        config={{
          width: 600,
          height: 800,
          minWidth: 400,
          maxWidth: 2000,
          minHeight: 600,
          maxHeight: 2000,
          size: 'stretch',
          maxShadowOpacity: 0.5,
          showCover: true,
          showPageNumbers: true,
          enableSpread: true,
          autoPlayOnMount: false,
          autoPlayInterval: 3000,
          showThumbnails: false,
          showTOC: false,
          enableZoom: true,
          enableFullscreen: true,
          enableKeyboard: true,
          enableURLSync: true,
          preloadPages: 3,
        }}
        onPageChange={(pageIndex) => {
          // Optionally handle page change
        }}
      />
    </div>
  );
}
