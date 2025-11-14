/**
 * FlipbookTOC Component
 * Displays table of contents sidebar for quick navigation
 */

import React from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TOCEntry } from '@/types/flipbook-types';

interface FlipbookTOCProps {
  entries: TOCEntry[];
  currentPage: number;
  onPageSelect: (pageIndex: number) => void;
  onClose?: () => void;
  className?: string;
}

export function FlipbookTOC({
  entries,
  currentPage,
  onPageSelect,
  onClose,
  className = '',
}: FlipbookTOCProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className={`bg-background border-l ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">Table of Contents</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close table of contents"
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          No table of contents available.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background border-l ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">Table of Contents</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close table of contents"
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100%-3rem)]">
        <nav className="p-2" role="navigation" aria-label="Table of contents">
          <ul className="space-y-1">
            {entries.map((entry, index) => (
              <TOCItem
                key={`${entry.pageIndex}-${index}`}
                entry={entry}
                currentPage={currentPage}
                onPageSelect={onPageSelect}
                level={0}
              />
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}

interface TOCItemProps {
  entry: TOCEntry;
  currentPage: number;
  onPageSelect: (pageIndex: number) => void;
  level: number;
}

function TOCItem({ entry, currentPage, onPageSelect, level }: TOCItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasChildren = entry.children && entry.children.length > 0;
  const isActive = currentPage === entry.pageIndex;

  const handleClick = () => {
    onPageSelect(entry.pageIndex);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div
        className={`
          group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors
          hover:bg-accent cursor-pointer
          ${isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-foreground'}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className="flex items-center justify-center w-4 h-4 hover:bg-accent-foreground/10 rounded"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        
        <button
          onClick={handleClick}
          className="flex-1 text-left truncate"
          aria-current={isActive ? 'page' : undefined}
        >
          {entry.title}
        </button>
        
        <span className="text-xs text-muted-foreground ml-auto pl-2">
          {entry.pageIndex + 1}
        </span>
      </div>
      
      {hasChildren && isExpanded && (
        <ul className="space-y-1 mt-1">
          {entry.children!.map((child, index) => (
            <TOCItem
              key={`${child.pageIndex}-${index}`}
              entry={child}
              currentPage={currentPage}
              onPageSelect={onPageSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
