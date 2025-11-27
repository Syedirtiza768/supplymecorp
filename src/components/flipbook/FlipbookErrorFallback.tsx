"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FlipbookErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export const FlipbookErrorFallback: React.FC<FlipbookErrorFallbackProps> = ({
  error = 'Failed to load catalog',
  onRetry,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-6 ${className || ''}`}>
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Unable to Load Catalog</h3>
          <p className="text-sm text-muted-foreground">
            {error}
          </p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlipbookErrorFallback;
