// src/services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Base API service for product-related endpoints
 */
export const productApi = {
  /**
   * Fetch products with pagination
   */
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);

    const response = await fetch(
      `${API_URL}/products?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id) {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID: ${id}`);
    }

    return response.json();
  },

  /**
   * Search products by query
   */
  async searchProducts(query, params = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(
      `${API_URL}/products/search?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    return response.json();
  },

  /**
   * Get all product categories
   */
  async getCategories() {
    const response = await fetch(`${API_URL}/products/filters/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch product categories");
    }

    return response.json();
  },

  /**
   * Get all product brands
   */
  async getBrands() {
    const response = await fetch(`${API_URL}/products/filters/brands`);

    if (!response.ok) {
      throw new Error("Failed to fetch product brands");
    }

    return response.json();
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category, params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(
      `${API_URL}/products/filters/by-category/${encodeURIComponent(
        category
      )}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`);
    }

    return response.json();
  },

  /**
   * Get products by brand
   */
  async getProductsByBrand(brand, params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(
      `${API_URL}/products/filters/by-brand/${encodeURIComponent(
        brand
      )}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products for brand: ${brand}`);
    }

    return response.json();
  },

  /**
   * Create a new product
   */
  async createProduct(product) {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, product) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product with ID: ${id}`);
    }

    return response.json();
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product with ID: ${id}`);
    }
  },
};
