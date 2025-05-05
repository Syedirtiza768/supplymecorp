// src/stores/productStore.js
import { create } from "zustand";
import { productApi } from "@/services/api";

export const useProductStore = create((set, get) => ({
  // Products state
  products: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
  error: null,

  // Filter options
  categories: [],
  brands: [],
  selectedCategory: null,
  selectedBrand: null,
  searchQuery: "",
  sortBy: "id",
  sortOrder: "DESC",

  // Active product for details view
  activeProduct: null,

  // Fetch all products with pagination
  fetchProducts: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const params = {
        page,
        limit,
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
        search: get().searchQuery,
      };

      const response = await productApi.getProducts(params);

      set({
        products: response.items,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        currentPage: response.meta.currentPage,
        itemsPerPage: response.meta.itemsPerPage,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching products:", error);
    }
  },

  // Fetch a single product by ID
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const product = await productApi.getProductById(id);
      set({ activeProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error(`Error fetching product ${id}:`, error);
    }
  },

  // Search products
  searchProducts: async (query = get().searchQuery, page = 1) => {
    set({ isLoading: true, error: null, searchQuery: query });

    try {
      const params = {
        page,
        limit: get().itemsPerPage,
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
      };

      if (!query) {
        return get().fetchProducts(page, get().itemsPerPage);
      }

      const response = await productApi.searchProducts(query, params);

      set({
        products: response.items,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        currentPage: response.meta.currentPage,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error searching products:", error);
    }
  },

  // Fetch all categories
  fetchCategories: async () => {
    try {
      const categories = await productApi.getCategories();
      set({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  // Fetch all brands
  fetchBrands: async () => {
    try {
      const brands = await productApi.getBrands();
      set({ brands });
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  },

  // Fetch products by category
  fetchProductsByCategory: async (category, page = 1) => {
    set({
      isLoading: true,
      error: null,
      selectedCategory: category,
      selectedBrand: null,
    });

    try {
      const params = {
        page,
        limit: get().itemsPerPage,
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
      };

      const response = await productApi.getProductsByCategory(category, params);

      set({
        products: response.items,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        currentPage: response.meta.currentPage,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error(`Error fetching products for category ${category}:`, error);
    }
  },

  // Fetch products by brand
  fetchProductsByBrand: async (brand, page = 1) => {
    set({
      isLoading: true,
      error: null,
      selectedBrand: brand,
      selectedCategory: null,
    });

    try {
      const params = {
        page,
        limit: get().itemsPerPage,
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
      };

      const response = await productApi.getProductsByBrand(brand, params);

      set({
        products: response.items,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        currentPage: response.meta.currentPage,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error(`Error fetching products for brand ${brand}:`, error);
    }
  },

  // Set sort options
  setSortOptions: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    // Refresh products with new sort options
    const { selectedCategory, selectedBrand, searchQuery } = get();

    if (selectedCategory) {
      get().fetchProductsByCategory(selectedCategory);
    } else if (selectedBrand) {
      get().fetchProductsByBrand(selectedBrand);
    } else if (searchQuery) {
      get().searchProducts(searchQuery);
    } else {
      get().fetchProducts();
    }
  },

  // Reset filters
  resetFilters: () => {
    set({
      selectedCategory: null,
      selectedBrand: null,
      searchQuery: "",
      sortBy: "id",
      sortOrder: "DESC",
    });
    get().fetchProducts();
  },

  // Create a new product
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });

    try {
      const newProduct = await productApi.createProduct(productData);
      // Refresh the product list
      get().fetchProducts();
      return newProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error creating product:", error);
    }
  },

  // Update an existing product
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProduct = await productApi.updateProduct(id, productData);

      // Update the product in the list if it exists
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
        activeProduct:
          state.activeProduct?.id === id ? updatedProduct : state.activeProduct,
        isLoading: false,
      }));

      return updatedProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error(`Error updating product ${id}:`, error);
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await productApi.deleteProduct(id);

      // Remove the product from the list
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        isLoading: false,
      }));

      // If the active product is the deleted one, clear it
      if (get().activeProduct?.id === id) {
        set({ activeProduct: null });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error(`Error deleting product ${id}:`, error);
    }
  },
}));
