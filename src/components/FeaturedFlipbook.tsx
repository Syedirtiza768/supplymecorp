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
  const pages: FlipbookPage[] = flipbook.pages.map((page) => ({
    id: page.id,
    src: page.imageUrl,
    alt: `Page ${page.pageNumber}`,
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
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-2">{flipbook.title}</h2>
      {flipbook.description && (
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          {flipbook.description}
        </p>
      )}
      <EnhancedFlipBook
        pages={pages}
        toc={toc}
        flipbookId={flipbook.id}
        config={{
          width: 400,
          height: 550,
          minWidth: 315,
          maxWidth: 1000,
          minHeight: 400,
          maxHeight: 1536,
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
