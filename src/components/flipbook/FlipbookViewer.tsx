'use client';

import { useState, useEffect } from 'react';
import { getPageWithHotspots, Hotspot, FlipbookPage } from '@/lib/flipbooks';
import { EnhancedFlipBook } from '@/components/flipbook';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FlipbookViewerProps {
  flipbookId: string;
  pageNumber: number;
}

export function FlipbookViewer({ flipbookId, pageNumber }: FlipbookViewerProps) {
  const router = useRouter();
  const [page, setPage] = useState<FlipbookPage | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching page data for:', { flipbookId, pageNumber });
        const result = await getPageWithHotspots(flipbookId, pageNumber);
        console.log('Received page data:', result);
        setPage(result.page);
        setHotspots(result.hotspots || []);
        console.log('Hotspots loaded:', result.hotspots?.length || 0);
      } catch (error) {
        console.error('Failed to load flipbook page:', error);
        setError(error instanceof Error ? error.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [flipbookId, pageNumber]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.linkUrl) {
      // Always open in a new tab, whether relative or absolute
      const url = hotspot.linkUrl.startsWith('http')
        ? hotspot.linkUrl
        : window.location.origin + hotspot.linkUrl;
      window.open(url, '_blank');
    } else if (hotspot.productSku) {
      // Navigate to product page in a new tab
      window.open(`/shop/${hotspot.productSku}`, '_blank');
    }
  };

  // For demo: show EnhancedFlipBook with just the current page as a single-page flipbook
  // In a real app, fetch all pages for the flipbookId and pass as pages
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">Error loading page</p>
          <p className="text-sm text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <p className="text-gray-600">Page not found</p>
      </div>
    );
  }

  // Demo: single-page flipbook
  return (
    <EnhancedFlipBook
      pages={[{
        id: page.id,
        src: page.imageUrl,
        alt: `Page ${pageNumber}`,
        hotspots: hotspots,
      }]}
      flipbookId={flipbookId}
      config={{ showPageNumbers: false }}
    />
  );
}