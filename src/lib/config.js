/**
 * Centralized configuration for API endpoints
 * 
 * ARCHITECTURE:
 * - Frontend (Next.js): Runs on port 3001, handles UI and Next.js API routes
 * - Backend (NestJS): Runs on port 3000, handles products/flipbooks/counterpoint integration
 * 
 * URL TYPES:
 * 1. Internal Next.js API Routes (/api/customers, etc.) - Use relative URLs, run on same port as frontend
 * 2. External Backend API (products, flipbooks, etc.) - Use BACKEND_API_URL, runs on port 3000
 */

// Backend NestJS API (port 3000)
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

// Frontend Next.js URL (port 3001)
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

// Authentication
export const CUSTOMERS_AUTH = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || process.env.CUSTOMERS_AUTH || '';

/**
 * Get the full URL for a Next.js API route
 * These routes run on the same port as the frontend (3001)
 * @param {string} path - The API path (e.g., '/api/customers')
 * @returns {string} Full URL or relative path
 */
export function getNextApiUrl(path) {
  // In browser, use relative URL (works on any port)
  if (typeof window !== 'undefined') {
    return path;
  }
  // In SSR, use full frontend URL
  return `${FRONTEND_URL}${path}`;
}

/**
 * Get the full URL for a backend API endpoint
 * These routes run on the NestJS backend (port 3000)
 * @param {string} path - The API path (e.g., '/api/products')
 * @returns {string} Full URL
 */
export function getBackendApiUrl(path) {
  return `${BACKEND_API_URL}${path}`;
}

// Export common headers
export const getAuthHeaders = () => ({
  'Authorization': CUSTOMERS_AUTH,
});

export const getApiHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth && CUSTOMERS_AUTH) {
    headers['Authorization'] = CUSTOMERS_AUTH;
  }
  
  return headers;
};
