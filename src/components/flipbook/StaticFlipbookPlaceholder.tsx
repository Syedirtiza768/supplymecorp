/**
 * Static Flipbook Placeholder Component
 * 
 * Renders instantly with a static image (cover page) while the real flipbook
 * initializes in the background. Provides immediate visual feedback to users.
 * 
 * Performance Benefits:
 * - Instant first paint
 * - No waiting for flipbook library to load
 * - Shows something meaningful immediately
 * - Reduces perceived load time significantly
 */

"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

interface StaticFlipbookPlaceholderProps {
  /** URL of the cover image to display */
  coverImageUrl?: string;
  
  /** Title to display */
  title?: string;
  
  /** Description text */
  description?: string;
  
  /** Width of the placeholder */
  width?: number;
  
  /** Height of the placeholder */
  height?: number;
  
  /** Show loading spinner */
  showLoader?: boolean;
  
  /** Loading message */
  loadingMessage?: string;
  
  /** Custom CSS class */
  className?: string;
}

export const StaticFlipbookPlaceholder: React.FC<StaticFlipbookPlaceholderProps> = ({
  coverImageUrl,
  title,
  description,
  width = 420,
  height = 560,
  showLoader = true,
  loadingMessage = 'Loading catalog...',
  className = '',
}) => {
  return (
    <div 
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}
      style={{
        width: '100%',
        maxWidth: width * 2, // Account for spread view
        minHeight: height,
      }}
    >
      {/* Cover Image Container */}
      <div 
        className="relative bg-white shadow-2xl rounded-sm overflow-hidden"
        style={{
          width: width,
          height: height,
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        {/* Cover Image or Fallback */}
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title || 'Catalog cover'}
            className="w-full h-full object-contain"
            style={{
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="text-center text-white p-8">
              {title && (
                <h2 className="text-3xl font-bold mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-lg opacity-90">{description}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {showLoader && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl px-6 py-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {loadingMessage}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Optional Title Below */}
      {title && !coverImageUrl && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Minimal Placeholder - Just a colored box with spinner
 * For situations where you want the absolute fastest render
 */
export const MinimalFlipbookPlaceholder: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 420, height = 560, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center bg-gray-200 rounded-sm ${className}`}
      style={{
        width: width,
        height: height,
        maxWidth: '90vw',
        maxHeight: '90vh',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
};
