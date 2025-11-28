/**
 * Canvas and WebGL Context Reuse Utilities
 * 
 * Provides utilities for reusing canvas elements and rendering contexts
 * across page transitions instead of recreating them. This significantly
 * improves performance by avoiding expensive initialization.
 * 
 * Performance Benefits:
 * - Eliminates canvas/context recreation overhead
 * - Reuses GPU resources for WebGL contexts
 * - Reduces memory allocation/deallocation
 * - Smoother page transitions
 */

interface CanvasPool {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  inUse: boolean;
  lastUsed: number;
}

interface WebGLPool {
  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext | null;
  inUse: boolean;
  lastUsed: number;
}

class CanvasManager {
  private canvasPool: CanvasPool[] = [];
  private webglPool: WebGLPool[] = [];
  private maxPoolSize = 5; // Limit pool size to prevent memory issues
  
  /**
   * Get or create a 2D canvas context
   * Reuses existing canvas if available
   */
  get2DContext(width: number, height: number): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  } {
    // Try to find unused canvas in pool
    let poolEntry = this.canvasPool.find(entry => !entry.inUse);
    
    if (poolEntry) {
      // Reuse existing canvas
      poolEntry.inUse = true;
      poolEntry.lastUsed = Date.now();
      poolEntry.canvas.width = width;
      poolEntry.canvas.height = height;
      
      if (poolEntry.context) {
        // Clear canvas for reuse
        poolEntry.context.clearRect(0, 0, width, height);
        
        return {
          canvas: poolEntry.canvas,
          context: poolEntry.context,
        };
      }
    }
    
    // Create new canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Hint for better performance
    });
    
    if (!context) {
      throw new Error('Failed to create 2D context');
    }
    
    // Add to pool if space available
    if (this.canvasPool.length < this.maxPoolSize) {
      this.canvasPool.push({
        canvas,
        context,
        inUse: true,
        lastUsed: Date.now(),
      });
    }
    
    return { canvas, context };
  }
  
  /**
   * Get or create a WebGL context
   * Reuses existing WebGL canvas if available
   */
  getWebGLContext(width: number, height: number): {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
  } | null {
    // Try to find unused WebGL canvas in pool
    let poolEntry = this.webglPool.find(entry => !entry.inUse);
    
    if (poolEntry) {
      // Reuse existing canvas
      poolEntry.inUse = true;
      poolEntry.lastUsed = Date.now();
      poolEntry.canvas.width = width;
      poolEntry.canvas.height = height;
      
      if (poolEntry.context) {
        // Clear for reuse
        poolEntry.context.clear(
          poolEntry.context.COLOR_BUFFER_BIT | 
          poolEntry.context.DEPTH_BUFFER_BIT
        );
        
        return {
          canvas: poolEntry.canvas,
          context: poolEntry.context,
        };
      }
    }
    
    // Create new WebGL canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false, // Better performance
      desynchronized: true,
    }) || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!context) {
      console.warn('WebGL not supported');
      return null;
    }
    
    // Add to pool if space available
    if (this.webglPool.length < this.maxPoolSize) {
      this.webglPool.push({
        canvas,
        context,
        inUse: true,
        lastUsed: Date.now(),
      });
    }
    
    return { canvas, context };
  }
  
  /**
   * Release a 2D canvas back to the pool
   */
  release2DCanvas(canvas: HTMLCanvasElement): void {
    const poolEntry = this.canvasPool.find(entry => entry.canvas === canvas);
    if (poolEntry) {
      poolEntry.inUse = false;
      poolEntry.lastUsed = Date.now();
    }
  }
  
  /**
   * Release a WebGL canvas back to the pool
   */
  releaseWebGLCanvas(canvas: HTMLCanvasElement): void {
    const poolEntry = this.webglPool.find(entry => entry.canvas === canvas);
    if (poolEntry) {
      poolEntry.inUse = false;
      poolEntry.lastUsed = Date.now();
    }
  }
  
  /**
   * Clean up old unused canvases
   * Call periodically to free memory
   */
  cleanup(maxAge: number = 30000): void {
    const now = Date.now();
    
    // Remove old 2D canvases
    this.canvasPool = this.canvasPool.filter(entry => {
      if (!entry.inUse && (now - entry.lastUsed) > maxAge) {
        // Remove canvas from DOM if attached
        if (entry.canvas.parentNode) {
          entry.canvas.parentNode.removeChild(entry.canvas);
        }
        return false;
      }
      return true;
    });
    
    // Remove old WebGL canvases
    this.webglPool = this.webglPool.filter(entry => {
      if (!entry.inUse && (now - entry.lastUsed) > maxAge) {
        // Lose context to free GPU memory
        const loseContext = entry.context?.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
        
        // Remove canvas from DOM if attached
        if (entry.canvas.parentNode) {
          entry.canvas.parentNode.removeChild(entry.canvas);
        }
        return false;
      }
      return true;
    });
  }
  
  /**
   * Clear all canvases and reset pool
   */
  reset(): void {
    // Lose all WebGL contexts
    this.webglPool.forEach(entry => {
      const loseContext = entry.context?.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    });
    
    this.canvasPool = [];
    this.webglPool = [];
  }
  
  /**
   * Get statistics about canvas pool
   */
  getStats(): {
    canvas2D: { total: number; inUse: number };
    webgl: { total: number; inUse: number };
  } {
    return {
      canvas2D: {
        total: this.canvasPool.length,
        inUse: this.canvasPool.filter(e => e.inUse).length,
      },
      webgl: {
        total: this.webglPool.length,
        inUse: this.webglPool.filter(e => e.inUse).length,
      },
    };
  }
}

// Singleton instance
let canvasManagerInstance: CanvasManager | null = null;

/**
 * Get the global canvas manager instance
 */
export function getCanvasManager(): CanvasManager {
  if (!canvasManagerInstance) {
    canvasManagerInstance = new CanvasManager();
  }
  return canvasManagerInstance;
}

/**
 * Reset the canvas manager (useful for cleanup)
 */
export function resetCanvasManager(): void {
  if (canvasManagerInstance) {
    canvasManagerInstance.reset();
  }
  canvasManagerInstance = null;
}

export { CanvasManager };
