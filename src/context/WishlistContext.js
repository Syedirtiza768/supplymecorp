"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

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

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem("sessionId", sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch wishlist items
  const fetchWishlist = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/wishlist?t=${Date.now()}`, {
        headers: {
          "x-session-id": sessionId,
          'Cache-Control': 'no-cache'
        },
      }).catch(err => {
        console.warn('Wishlist API unavailable:', err.message);
        return null;
      });

      if (res && res.ok) {
        const data = await res.json();
        setWishlistItems(data.items || []);
        setWishlistCount(data.items?.length || 0);
      } else if (res) {
        console.error('Failed to fetch wishlist:', res.status);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fetch wishlist count
  const fetchWishlistCount = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/wishlist/count?t=${Date.now()}`, {
        headers: {
          "x-session-id": sessionId,
          'Cache-Control': 'no-cache'
        },
      }).catch(err => {
        console.warn('Wishlist count API unavailable:', err.message);
        return null;
      });

      if (res && res.ok) {
        const data = await res.json();
        setWishlistCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchWishlist();
    }
  }, [sessionId, fetchWishlist]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productId) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    // Optimistic update
    const tempItem = { productId: String(productId), _optimistic: true };
    setWishlistItems(prev => [...prev, tempItem]);
    setWishlistCount(prev => prev + 1);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/wishlist/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ productId: String(productId) }),
      });

      const data = await response.json();
      
      if (data.ok) {
        // Refresh wishlist
        await fetchWishlist();
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

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    if (!sessionId) return { success: false };

    // Optimistic update
    const previousItems = [...wishlistItems];
    const previousCount = wishlistCount;
    setWishlistItems(prev => prev.filter(item => String(item.productId) !== String(productId)));
    setWishlistCount(prev => Math.max(0, prev - 1));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/wishlist/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      const data = await response.json();
      
      if (data.ok) {
        // Refresh wishlist
        await fetchWishlist();
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

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    if (!sessionId) return { success: false };

    // Optimistic update
    const previousItems = [...wishlistItems];
    const previousCount = wishlistCount;
    setWishlistItems([]);
    setWishlistCount(0);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/wishlist`, {
        method: "DELETE",
        headers: {
          "x-session-id": sessionId,
        },
      });

      const data = await response.json();
      
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
