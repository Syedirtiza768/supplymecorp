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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        headers: {
          "x-session-id": sessionId,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data.items || []);
        setWishlistCount(data.items?.length || 0);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/count`, {
        headers: {
          "x-session-id": sessionId,
        },
      });

      if (res.ok) {
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
  const addToWishlist = async (productId) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ productId: String(productId) }),
      });

      const data = await response.json();
      
      if (data.ok) {
        await fetchWishlist();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return { success: false, error: "Failed to add to wishlist" };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!sessionId) return { success: false };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      const data = await response.json();
      
      if (data.ok) {
        await fetchWishlist();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false };
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!sessionId) return { success: false };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        method: "DELETE",
        headers: {
          "x-session-id": sessionId,
        },
      });

      const data = await response.json();
      
      if (data.ok) {
        setWishlistItems([]);
        setWishlistCount(0);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      return { success: false };
    }
  };

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
