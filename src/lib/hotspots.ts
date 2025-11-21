// src/lib/hotspots.ts

export type Product = {
  id: string;
  name: string;
  sku?: string;
};

export type Hotspot = {
  id: string;
  flipbookId: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  productId?: string | null;
  product?: Product | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Get Authorization from env
const getAuthHeaders = (): Record<string, string> => {
  const auth = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || process.env.CUSTOMERS_AUTH;
  if (auth) {
    return { 'Authorization': auth };
  }
  return {};
};

export async function fetchHotspots(flipbookId: string, pageNumber: number) {
  const url = new URL(`${API_URL}/hotspots`);
  url.searchParams.set("flipbookId", flipbookId);
  url.searchParams.set("pageNumber", String(pageNumber));

  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to load hotspots: ${res.status} ${res.statusText}`, errorText);
    throw new Error(`Failed to load hotspots: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as Hotspot[];
}

export async function createHotspotApi(
  flipbookId: string,
  pageNumber: number,
  rect: { x: number; y: number; width: number; height: number }
) {
  const res = await fetch(`${API_URL}/hotspots`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      flipbookId,
      pageNumber,
      ...rect,
    }),
  });

  if (!res.ok) throw new Error("Failed to create hotspot");
  return (await res.json()) as Hotspot;
}

export async function updateHotspotApi(
  id: string,
  partial: Partial<Hotspot>
) {
  const res = await fetch(`${API_URL}/hotspots/${id}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(partial),
  });

  if (!res.ok) throw new Error("Failed to update hotspot");
  return (await res.json()) as Hotspot;
}

export async function deleteHotspotApi(id: string) {
  const res = await fetch(`${API_URL}/hotspots/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete hotspot");
  return true;
}

export async function searchProducts(term: string) {
  if (!term.trim()) return [] as Product[];

  const url = new URL(`${API_URL}/products/search`);
  url.searchParams.set("query", term);
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "10");
  url.searchParams.set("sortBy", "name");
  url.searchParams.set("sortOrder", "asc");

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to search products");

  const json = await res.json();
  
  // Handle different response formats
  let data = [];
  if (Array.isArray(json.data)) {
    data = json.data;
  } else if (Array.isArray(json.items)) {
    data = json.items;
  } else if (Array.isArray(json)) {
    data = json;
  }
  
  // Map to expected Product format
  return data.map((p: any) => ({
    id: p.id || p.sku,
    name: p.onlineTitleDescription || p.name || p.brandName || 'Product',
    sku: p.sku || p.id,
  })) as Product[];
}
