'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hotspot } from '@/types/flipbook';
import { percentToPixels } from '@/lib/flipbook-utils';

interface FlipbookPageWithHotspotsProps {
  pageNumber: number;
  imageUrl: string;
  flipbookId?: string;
  className?: string;
}

export function FlipbookPageWithHotspots({
  pageNumber,
  imageUrl,
  flipbookId = 'catalog-2024',
  className = '',
}: FlipbookPageWithHotspotsProps) {
  const router = useRouter();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        // Use API route with prefix
        const res = await fetch(
          `${apiUrl}/api/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots`,
          { cache: 'no-store' }
        );

        if (res.ok) {
          const data = await res.json();
          // Hotspots from backend are pixel-based; store as-is and convert at render time
          setHotspots((data.hotspots || []));
        }
      } catch (error) {
        console.error('Failed to load hotspots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, [flipbookId, pageNumber]);

  // Detect flip animations by monitoring page flip events
  useEffect(() => {
    const detectFlipStart = () => setIsFlipping(true);
    const detectFlipEnd = () => setTimeout(() => setIsFlipping(false), 100);

    // Listen for flip events from react-pageflip
    window.addEventListener('pageflip-start', detectFlipStart);
    window.addEventListener('pageflip-end', detectFlipEnd);

    return () => {
      window.removeEventListener('pageflip-start', detectFlipStart);
      window.removeEventListener('pageflip-end', detectFlipEnd);
    };
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setContainerSize({
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
    });
  };

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent page flip when clicking hotspot
    
    if (hotspot.linkUrl) {
      // Check if URL is from the same domain (absolute URL pointing to our site)
      const currentOrigin = window.location.origin;
      const isSameDomain = hotspot.linkUrl.startsWith(currentOrigin) || 
                          hotspot.linkUrl.startsWith('http://localhost:3001') ||
                          hotspot.linkUrl.startsWith('https://dev.rrgeneralsupply.com');
      
      if (isSameDomain) {
        // Extract path from absolute URL and navigate via router
        try {
          const url = new URL(hotspot.linkUrl);
          router.push(url.pathname + url.search + url.hash);
        } catch (e) {
          // Fallback to direct navigation
          router.push(hotspot.linkUrl);
        }
      } else if (hotspot.linkUrl.startsWith('http')) {
        // External URL - open in new tab
        window.open(hotspot.linkUrl, '_blank');
      } else {
        // Relative URL - use router
        router.push(hotspot.linkUrl);
      }
    } else if (hotspot.productSku) {
      // Navigate to product page
      router.push(`/shop/${hotspot.productSku}`);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Page Image */}
      <img
        src={imageUrl}
        alt={`Page ${pageNumber}`}
        className="block w-full h-full object-contain select-none"
        onLoad={handleImageLoad}
        draggable={false}
      />

      {/* Hotspots Overlay */}
      {!loading && containerSize.width > 0 && containerSize.height > 0 && hotspots.map((hotspot, index) => {
        // Convert pixel-based rect to percentage for CSS positioning
        const percentRect = pixelsToPercent(
          { x: hotspot.x, y: hotspot.y, width: hotspot.width, height: hotspot.height },
          containerSize.width,
          containerSize.height,
        );
        return (
          <div
            key={hotspot.id ?? `temp-${index}`}
            className={`absolute group z-10 transition-all duration-200 ${
              isFlipping ? 'pointer-events-none opacity-30' : 'cursor-pointer'
            }`}
            style={{
              left: `${percentRect.x}%`,
              top: `${percentRect.y}%`,
              width: `${percentRect.width}%`,
              height: `${percentRect.height}%`,
              zIndex: (hotspot.zIndex ?? 0) + 10,
            }}
            onClick={(e) => !isFlipping && handleHotspotClick(hotspot, e)}
            title={hotspot.label || `View ${hotspot.productSku}`}
          >
            {/* Enhanced hover highlight with glow */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-blue-500/25 transition-all duration-200 border-2 border-transparent group-hover:border-blue-400 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded" />
            
            {/* Label tooltip on hover */}
            {hotspot.label && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[99999]">
                {hotspot.label}
              </div>
            )}
            
            {/* Optional: Small indicator dot */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
