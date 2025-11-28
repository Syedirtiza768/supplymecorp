// Download PDF for a flipbook
export async function downloadFlipbookPDF(flipbookId: string, filename?: string): Promise<void> {
  const url = `${API_URL}/api/flipbooks/${flipbookId}/export/pdf`;
  const headers = getAuthHeaders();
  let res;
  try {
    res = await fetch(url, { headers });
  } catch (err) {
    console.error('PDF export fetch failed:', { url, headers, error: err });
    throw new Error('Network error while trying to download PDF.');
  }
  if (!res.ok) {
    const text = await res.text();
    console.error('PDF export failed:', { url, headers, status: res.status, statusText: res.statusText, body: text });
    throw new Error(`Failed to download PDF: ${res.status} ${res.statusText} - ${text}`);
  }
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename || `${flipbookId}.pdf`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 100);
}
// Delete a single page
export async function deletePage(flipbookId: string, pageNumber: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/flipbooks/${flipbookId}/pages/${pageNumber}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete page');
}

// Delete multiple pages
export async function deletePages(flipbookId: string, pageNumbers: number[]): Promise<void> {
  const url = new URL(`${API_URL}/api/flipbooks/${flipbookId}/pages`);
  url.searchParams.set('pages', pageNumbers.join(','));
  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete pages');
}
// src/lib/flipbooks.ts
// Central API client for flipbook + page + hotspot operations

export interface Flipbook {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlipbookPage {
  id: string;
  flipbookId: string;
  pageNumber: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HotspotInput {
  id?: string; // optional (for updating)
  productSku?: string; // optional - hotspot can exist without product
  label?: string;
  linkUrl?: string;
  x: number; // percent 0-100
  y: number; // percent 0-100
  width: number; // percent 0-100
  height: number; // percent 0-100
  zIndex?: number;
  meta?: Record<string, any>;
}

export interface Hotspot extends HotspotInput {
  id: string; // required once persisted
}

export interface PageWithHotspotsResult {
  page: FlipbookPage;
  hotspots: Hotspot[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Reuse existing auth env if present
function getAuthHeaders(): Record<string, string> {
  const auth = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || process.env.CUSTOMERS_AUTH;
  return auth ? { Authorization: auth } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    console.error('API error', res.status, res.statusText, body);
    throw new Error(`API error ${res.status} "${res.statusText}" "${body}"`);
  }
  return res.json();
}

// Ensure a flipbook exists by title (create or return existing)
export async function ensureFlipbook(title: string): Promise<Flipbook> {
  const res = await fetch(`${API_URL}/api/flipbooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title }),
  });
  return handleResponse<Flipbook>(res);
}

// List all pages for a given flipbook
export async function listPages(flipbookId: string): Promise<FlipbookPage[]> {
  const res = await fetch(`${API_URL}/api/flipbooks/${flipbookId}/pages`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<FlipbookPage[]>(res);
}

// Get a specific page and its hotspots
export async function getPageWithHotspots(
  flipbookId: string,
  pageNumber: number,
): Promise<PageWithHotspotsResult> {
  const res = await fetch(
    `${API_URL}/api/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots`,
    { headers: getAuthHeaders(), cache: 'no-store' },
  );
  return handleResponse<PageWithHotspotsResult>(res);
}

// Upload a page image (multipart)
export async function uploadPageImage(
  flipbookId: string,
  file: File,
  pageNumber?: number,
): Promise<FlipbookPage> {
  const form = new FormData();
  form.append('image', file);
  const url = new URL(`${API_URL}/api/flipbooks/${flipbookId}/pages/upload`);
  if (pageNumber) url.searchParams.set('pageNumber', String(pageNumber));

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: form,
  });
  return handleResponse<FlipbookPage>(res);
}

// Save (replace) hotspots for a page atomically
export async function savePageHotspots(
  flipbookId: string,
  pageNumber: number,
  hotspots: HotspotInput[],
): Promise<Hotspot[]> {
  console.log('Saving hotspots:', { flipbookId, pageNumber, count: hotspots.length });
  console.log('Hotspots payload:', JSON.stringify(hotspots, null, 2));
  
  const url = `${API_URL}/api/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots?replace=true`;
  console.log('PUT request to:', url);
  
  const res = await fetch(
    url,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ hotspots }),
    },
  );
  
  console.log('Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Save hotspots failed:', { status: res.status, statusText: res.statusText, body: errorText });
    throw new Error(`Failed to save hotspots: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Hotspots saved successfully:', result);
  return result;
}

// Product search (mock backend)
export async function searchProducts(query: string): Promise<{ sku: string; name: string; price?: number }[]> {
  const url = new URL(`${API_URL}/api/products/quick-search`);
  url.searchParams.set('query', query);
  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  return handleResponse<{ sku: string; name: string; price?: number }[]>(res);
}

// Helpers for coordinate conversion
export function pxToPercent(value: number, total: number): number {
  return Number(((value / total) * 100).toFixed(4));
}

export function percentToPx(percent: number, total: number): number {
  return Math.round((percent / 100) * total);
}

// Clamp hotspot inside bounds (percent space)
export function clampHotspot(h: HotspotInput): HotspotInput {
  const x = Math.min(Math.max(h.x, 0), 100);
  const y = Math.min(Math.max(h.y, 0), 100);
  const width = Math.min(Math.max(h.width, 0.1), 100 - x);
  const height = Math.min(Math.max(h.height, 0.1), 100 - y);
  return { ...h, x, y, width, height };
}
