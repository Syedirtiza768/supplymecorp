"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface FlipbookLoaderProps {
  progress?: number;
  status?: string;
  className?: string;
}

export const FlipbookLoader: React.FC<FlipbookLoaderProps> = ({
  progress = 0,
  status = 'Loading catalog...',
  className
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6 max-w-md px-6">
        {/* Animated Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{status}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Status Text (when no progress) */}
        {progress === 0 && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlipbookLoader;
