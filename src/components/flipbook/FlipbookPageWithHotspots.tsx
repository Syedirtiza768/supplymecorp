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

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(
          `${apiUrl}/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots`,
          { cache: 'no-store' }
        );

        if (res.ok) {
          const data = await res.json();
          setHotspots(data.hotspots || []);
        }
      } catch (error) {
        console.error('Failed to load hotspots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, [flipbookId, pageNumber]);

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
      // Custom link
      if (hotspot.linkUrl.startsWith('http')) {
        window.open(hotspot.linkUrl, '_blank');
      } else {
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
        return (
          <div
            key={hotspot.id ?? `temp-${index}`}
            className="absolute cursor-pointer group z-10"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              zIndex: (hotspot.zIndex ?? 0) + 10,
            }}
            onClick={(e) => handleHotspotClick(hotspot, e)}
            title={hotspot.label || `View ${hotspot.productSku}`}
          >
            {/* Invisible clickable area with hover effect */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-blue-500/20 transition-colors border-2 border-transparent group-hover:border-blue-500 rounded" />
            
            {/* Label tooltip on hover */}
            {hotspot.label && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {hotspot.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
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
