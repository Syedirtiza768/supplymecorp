export interface FlipbookPage {
  id: string;
  flipbookId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface Hotspot {
  id?: string;
  productSku: string;
  label?: string;
  linkUrl?: string;
  x: number; // 0–100 percentage
  y: number; // 0–100 percentage
  width: number; // 0–100 percentage
  height: number; // 0–100 percentage
  zIndex?: number;
  meta?: any;
}

export type InteractionMode =
  | { type: 'idle' }
  | { type: 'drawing'; startX: number; startY: number; currentX: number; currentY: number }
  | { type: 'dragging'; hotspotId: string }
  | { type: 'resizing'; hotspotId: string };

export interface ProductSearchResult {
  sku: string;
  name: string;
  price?: number;
}

export interface RectPercent {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RectPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}
