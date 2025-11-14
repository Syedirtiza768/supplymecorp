/**
 * FlipbookThumbnails Component
 * Displays a horizontal scrollable strip of page thumbnails
 * with lazy loading for performance
 */

import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FlipbookPage } from '@/types/flipbook-types';

interface FlipbookThumbnailsProps {
  pages: FlipbookPage[];
  currentPage: number;
  onPageSelect: (pageIndex: number) => void;
  onClose?: () => void;
  className?: string;
}

export function FlipbookThumbnails({
  pages,
  currentPage,
  onPageSelect,
  onClose,
  className = '',
}: FlipbookThumbnailsProps) {
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll current thumbnail into view
  useEffect(() => {
    const currentThumbnail = thumbnailRefs.current[currentPage];
    if (currentThumbnail && scrollContainerRef.current) {
      currentThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPage]);

  return (
    <div className={`bg-background border-t ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-sm font-semibold">Thumbnails</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close thumbnails"
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 p-4 overflow-x-auto"
          role="list"
          aria-label="Page thumbnails"
        >
          {pages.map((page, index) => (
            <ThumbnailItem
              key={page.id}
              page={page}
              index={index}
              isActive={index === currentPage}
              onClick={() => onPageSelect(index)}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ThumbnailItemProps {
  page: FlipbookPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ThumbnailItem = React.forwardRef<HTMLButtonElement, ThumbnailItemProps>(
  ({ page, index, isActive, onClick }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          rootMargin: '200px', // Start loading 200px before coming into view
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, []);

    const thumbnailSrc = page.thumbnailSrc || page.src;

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          flex-shrink-0 w-24 h-32 rounded-md overflow-hidden border-2 transition-all
          hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary
          ${isActive ? 'border-primary shadow-md scale-105' : 'border-border'}
        `}
        aria-label={`Go to page ${index + 1}`}
        aria-current={isActive ? 'page' : undefined}
        role="listitem"
      >
        <div ref={imgRef} className="relative w-full h-full bg-muted">
          {isVisible && (
            <img
              src={thumbnailSrc}
              alt={page.alt || `Page ${index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                hasLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setHasLoaded(true)}
              loading="lazy"
            />
          )}
          {!hasLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
            {index + 1}
          </div>
        </div>
      </button>
    );
  }
);

ThumbnailItem.displayName = 'ThumbnailItem';
