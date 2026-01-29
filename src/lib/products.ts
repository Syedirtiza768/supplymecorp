const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

// Sort products by price (items with price > 0 first)
function sortProductsByPrice(products: any[]): any[] {
  if (!Array.isArray(products)) return products;
  return [...products].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;
    if (priceA > 0 && priceB === 0) return -1;
    if (priceA === 0 && priceB > 0) return 1;
    return 0;
  });
}

export async function fetchNewProductsByCategory(): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products/new-by-category`);
  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch new products by category: ${response.status}`);
  }
  const products = await response.json();
  return sortProductsByPrice(products);
}

export interface Product {
  id: string;
  brandName?: string;
  onlineTitleDescription?: string;
  onlineLongDescription?: string;
  itemImage1?: string;
  itemImage2?: string;
  itemImage3?: string;
  itemImage4?: string;
  viewCount?: number;
  createdAt?: string;
  featured?: boolean;
  upcCode?: string;
  modelNumber?: string;
  categoryTitleDescription?: string;
  price?: number;
  regularPrice?: number;
}

export async function fetchNewProducts(limit = 12): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products/new`);
  url.searchParams.set('limit', String(limit));
  
  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch new products: ${response.status}`);
  }
  
  const products = await response.json();
  return sortProductsByPrice(products);
}

export async function fetchMostViewed(limit = 12, days?: number): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products/most-viewed`);
  url.searchParams.set('limit', String(limit));
  if (days) url.searchParams.set('days', String(days));
  
  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch most viewed products: ${response.status}`);
  }
  
  const products = await response.json();
  return sortProductsByPrice(products);
}

export async function fetchFeaturedProducts(limit = 12): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products/featured`);
  url.searchParams.set('limit', String(limit));
  
  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured products: ${response.status}`);
  }
  
  const products = await response.json();
  return sortProductsByPrice(products);
}
