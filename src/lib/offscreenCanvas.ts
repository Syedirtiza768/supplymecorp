/**
 * OffscreenCanvas Utilities
 * 
 * Provides utilities for using OffscreenCanvas for rendering when supported.
 * OffscreenCanvas allows rendering to happen off the main thread, improving
 * performance for complex rendering operations.
 * 
 * Performance Benefits:
 * - Rendering happens off main thread
 * - No blocking of UI during complex operations
 * - Better frame rates during page flips
 * - Graceful fallback to regular canvas
 */

/**
 * Check if OffscreenCanvas is supported
 */
export function isOffscreenCanvasSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return typeof OffscreenCanvas !== 'undefined';
}

/**
 * Create an OffscreenCanvas if supported, otherwise create regular canvas
 */
export function createCanvas(
  width: number,
  height: number
): HTMLCanvasElement | OffscreenCanvas {
  if (isOffscreenCanvasSupported()) {
    return new OffscreenCanvas(width, height);
  }
  
  // Fallback to regular canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Get 2D rendering context from canvas (works with both types)
 */
export function get2DContext(
  canvas: HTMLCanvasElement | OffscreenCanvas
): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  return canvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
  }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
}

/**
 * Get WebGL context from canvas (works with both types)
 */
export function getWebGLContext(
  canvas: HTMLCanvasElement | OffscreenCanvas
): WebGLRenderingContext | null {
  const context = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: false,
    desynchronized: true,
  }) || canvas.getContext('experimental-webgl');
  
  return context as WebGLRenderingContext | null;
}

/**
 * Transfer OffscreenCanvas to worker
 * Returns transferable for postMessage
 */
export function transferToWorker(
  canvas: HTMLCanvasElement
): OffscreenCanvas | null {
  if (!isOffscreenCanvasSupported()) {
    console.warn('OffscreenCanvas not supported, cannot transfer to worker');
    return null;
  }
  
  try {
    // Transfer control to OffscreenCanvas
    const offscreen = (canvas as any).transferControlToOffscreen?.();
    return offscreen || null;
  } catch (err) {
    console.error('Failed to transfer canvas to worker:', err);
    return null;
  }
}

/**
 * Render image to canvas (optimized for both canvas types)
 */
export async function renderImageToCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  imageSource: HTMLImageElement | ImageBitmap | Blob,
  options?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    backgroundColor?: string;
  }
): Promise<void> {
  const context = get2DContext(canvas);
  if (!context) {
    throw new Error('Failed to get 2D context');
  }
  
  const {
    x = 0,
    y = 0,
    width = canvas.width,
    height = canvas.height,
    backgroundColor,
  } = options || {};
  
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fill background if specified
  if (backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw image
  if (imageSource instanceof Blob) {
    // Convert Blob to ImageBitmap for better performance
    const bitmap = await createImageBitmap(imageSource);
    context.drawImage(bitmap, x, y, width, height);
    bitmap.close();
  } else {
    context.drawImage(imageSource, x, y, width, height);
  }
}

/**
 * Convert canvas to Blob
 * Works with both HTMLCanvasElement and OffscreenCanvas
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type: string = 'image/png',
  quality?: number
): Promise<Blob> {
  if (canvas instanceof OffscreenCanvas) {
    return await canvas.convertToBlob({ type, quality });
  }
  
  // Regular canvas
  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Create ImageBitmap from image source
 * ImageBitmap is more performant for canvas operations
 */
export async function createOptimizedImage(
  source: HTMLImageElement | Blob | ImageData,
  options?: ImageBitmapOptions
): Promise<ImageBitmap> {
  if (typeof createImageBitmap === 'undefined') {
    throw new Error('createImageBitmap not supported');
  }
  
  return await createImageBitmap(source, options);
}

/**
 * Batch image processing using OffscreenCanvas
 * Useful for generating thumbnails or applying filters
 */
export class OffscreenCanvasProcessor {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  
  constructor(width: number, height: number) {
    this.canvas = createCanvas(width, height);
    const context = get2DContext(this.canvas);
    
    if (!context) {
      throw new Error('Failed to create canvas context');
    }
    
    this.context = context;
  }
  
  /**
   * Resize and return image as blob
   */
  async resizeImage(
    source: HTMLImageElement | ImageBitmap | Blob,
    targetWidth: number,
    targetHeight: number,
    format: string = 'image/jpeg',
    quality: number = 0.85
  ): Promise<Blob> {
    // Resize canvas
    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;
    
    // Render image
    await renderImageToCanvas(this.canvas, source, {
      width: targetWidth,
      height: targetHeight,
    });
    
    // Convert to blob
    return await canvasToBlob(this.canvas, format, quality);
  }
  
  /**
   * Apply filter to image
   */
  async applyFilter(
    source: HTMLImageElement | ImageBitmap | Blob,
    filter: string
  ): Promise<Blob> {
    // Render image
    await renderImageToCanvas(this.canvas, source);
    
    // Apply filter
    this.context.filter = filter;
    this.context.drawImage(this.canvas as any, 0, 0);
    
    // Reset filter
    this.context.filter = 'none';
    
    // Convert to blob
    return await canvasToBlob(this.canvas);
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/**
 * Check if browser supports OffscreenCanvas features
 */
export function getOffscreenCanvasCapabilities(): {
  supported: boolean;
  canTransferToWorker: boolean;
  canConvertToBlob: boolean;
  canCreateImageBitmap: boolean;
} {
  return {
    supported: isOffscreenCanvasSupported(),
    canTransferToWorker: typeof (HTMLCanvasElement.prototype as any).transferControlToOffscreen === 'function',
    canConvertToBlob: isOffscreenCanvasSupported() && typeof OffscreenCanvas.prototype.convertToBlob === 'function',
    canCreateImageBitmap: typeof createImageBitmap === 'function',
  };
}
