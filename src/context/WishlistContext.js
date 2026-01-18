"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cachedFetch, mutate, invalidateCache } from "@/lib/apiCache";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const fetchingRef = useRef(false);

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem("sessionId", sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch wishlist items with caching
  const fetchWishlist = useCallback(async (skipCache = false) => {
    if (!sessionId) return;
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await cachedFetch(
        `${apiUrl}/api/wishlist`,
        { headers: { "x-session-id": sessionId } },
        { skip: skipCache }
      );
      
      setWishlistItems(data.items || []);
      setWishlistCount(data.items?.length || 0);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [sessionId]);

  // Fetch wishlist count with caching
  const fetchWishlistCount = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await cachedFetch(
        `${apiUrl}/api/wishlist/count`,
        { headers: { "x-session-id": sessionId } }
      );
      
      setWishlistCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchWishlist();
    }
  }, [sessionId, fetchWishlist]);

  // Add item to wishlist with optimistic update
  const addToWishlist = useCallback(async (productId) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    // Optimistic update
    const tempItem = { productId: String(productId), _optimistic: true };
    setWishlistItems(prev => [...prev, tempItem]);
    setWishlistCount(prev => prev + 1);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await mutate(
        `${apiUrl}/api/wishlist/items`,
        {
          method: "POST",
          headers: { "x-session-id": sessionId },
          body: JSON.stringify({ productId: String(productId) }),
        },
        ['/api/wishlist']
      );
      
      if (data.ok) {
        // Background refresh
        fetchWishlist(true);
        return { success: true };
      } else {
        // Rollback
        setWishlistItems(prev => prev.filter(item => !item._optimistic));
        setWishlistCount(prev => prev - 1);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Rollback
      setWishlistItems(prev => prev.filter(item => !item._optimistic));
      setWishlistCount(prev => prev - 1);
      return { success: false, error: "Failed to add to wishlist" };
    }
  }, [sessionId, fetchWishlist]);

  // Remove item from wishlist with optimistic update
  const removeFromWishlist = useCallback(async (productId) => {
    if (!sessionId) return { success: false };

    // Optimistic update
    const previousItems = [...wishlistItems];
    const previousCount = wishlistCount;
    setWishlistItems(prev => prev.filter(item => String(item.productId) !== String(productId)));
    setWishlistCount(prev => Math.max(0, prev - 1));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await mutate(
        `${apiUrl}/api/wishlist/items/${productId}`,
        {
          method: "DELETE",
          headers: { "x-session-id": sessionId },
        },
        ['/api/wishlist']
      );
      
      if (data.ok) {
        // Background refresh
        fetchWishlist(true);
        return { success: true };
      } else {
        // Rollback
        setWishlistItems(previousItems);
        setWishlistCount(previousCount);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Rollback
      setWishlistItems(previousItems);
      setWishlistCount(previousCount);
      return { success: false };
    }
  }, [sessionId, wishlistItems, wishlistCount, fetchWishlist]);

  // Clear entire wishlist with optimistic update
  const clearWishlist = useCallback(async () => {
    if (!sessionId) return { success: false };

    // Optimistic update
    const previousItems = [...wishlistItems];
    const previousCount = wishlistCount;
    setWishlistItems([]);
    setWishlistCount(0);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await mutate(
        `${apiUrl}/api/wishlist`,
        {
          method: "DELETE",
          headers: { "x-session-id": sessionId },
        },
        ['/api/wishlist']
      );
      
      if (data.ok) {
        return { success: true };
      } else {
        // Rollback
        setWishlistItems(previousItems);
        setWishlistCount(previousCount);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      // Rollback
      setWishlistItems(previousItems);
      setWishlistCount(previousCount);
      return { success: false };
    }
  }, [sessionId, wishlistItems, wishlistCount]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => String(item.productId) === String(productId));
  }, [wishlistItems]);

  // Toggle wishlist item
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
