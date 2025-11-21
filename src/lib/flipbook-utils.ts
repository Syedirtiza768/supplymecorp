import { RectPercent, RectPixels } from '@/types/flipbook';

/**
 * Convert percentage-based rectangle to pixel coordinates
 * Ensures values stay within container bounds
 */
export function percentToPixels(
  rect: RectPercent,
  containerWidth: number,
  containerHeight: number,
): RectPixels {
  return {
    x: clamp((rect.x / 100) * containerWidth, 0, containerWidth),
    y: clamp((rect.y / 100) * containerHeight, 0, containerHeight),
    width: clamp((rect.width / 100) * containerWidth, 0, containerWidth),
    height: clamp((rect.height / 100) * containerHeight, 0, containerHeight),
  };
}

/**
 * Convert pixel-based rectangle to percentage coordinates
 * Clamps results to 0-100 range to prevent overflow
 */
export function pixelsToPercent(
  rect: RectPixels,
  containerWidth: number,
  containerHeight: number,
): RectPercent {
  if (containerWidth === 0 || containerHeight === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return {
    x: clamp((rect.x / containerWidth) * 100, 0, 100),
    y: clamp((rect.y / containerHeight) * 100, 0, 100),
    width: clamp((rect.width / containerWidth) * 100, 0, 100),
    height: clamp((rect.height / containerHeight) * 100, 0, 100),
  };
}

/**
 * Snap value to grid (nearest 0.5%)
 */
export function snapToGrid(value: number, enabled: boolean): number {
  if (!enabled) return value;
  return Math.round(value * 2) / 2; // Snap to nearest 0.5%
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get mouse position relative to container element
 */
export function getRelativePosition(
  event: React.MouseEvent,
  container: HTMLElement,
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
