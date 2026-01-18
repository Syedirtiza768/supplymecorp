"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
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

  // Fetch all reviews for a product
  const getProductReviews = useCallback(async (productId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/reviews/product/${productId}`
      );

      if (res.ok) {
        const data = await res.json();
        return { success: true, reviews: data.reviews || [] };
      } else {
        return { success: false, reviews: [], error: "Failed to fetch reviews" };
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return { success: false, reviews: [], error: "Failed to fetch reviews" };
    }
  }, []);

  // Get average rating for a product
  const getAverageRating = useCallback(async (productId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/reviews/product/${productId}/average`
      );

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0,
        };
      } else {
        return { success: false, averageRating: 0, totalReviews: 0 };
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return { success: false, averageRating: 0, totalReviews: 0 };
    }
  }, []);

  // Get user's review for a product
  const getUserReview = useCallback(async (productId) => {
    if (!sessionId) return { success: false, review: null };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/reviews/product/${productId}/user`,
        {
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        return { success: true, review: data.review };
      } else {
        return { success: false, review: null };
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
      return { success: false, review: null };
    }
  }, [sessionId]);

  // Add a new review
  const addReview = useCallback(async (productId, rating, comment, userName) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({
          productId: String(productId),
          rating,
          comment: comment || "",
          userName: userName || "Anonymous",
        }),
      });

      const data = await response.json();

      if (data.ok) {
        return { success: true, review: data.review };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error adding review:", error);
      return { success: false, error: "Failed to add review" };
    }
  }, [sessionId]);

  // Update an existing review with cache invalidation
  const updateReview = useCallback(async (reviewId, rating, comment, productId) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await mutate(
        `${apiUrl}/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: { "x-session-id": sessionId },
          body: JSON.stringify({ rating, comment }),
        },
        productId ? [`/api/reviews/product/${productId}`] : ['/api/reviews']
      );

      if (data.ok) {
        return { success: true, review: data.review };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error updating review:", error);
      return { success: false, error: "Failed to update review" };
    }
  }, [sessionId]);

  // Delete a review with cache invalidation
  const deleteReview = useCallback(async (reviewId, productId) => {
    if (!sessionId) return { success: false, error: "No session ID" };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const data = await mutate(
        `${apiUrl}/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { "x-session-id": sessionId },
        },
        productId ? [`/api/reviews/product/${productId}`] : ['/api/reviews']
      );

      if (data.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      return { success: false, error: "Failed to delete review" };
    }
  }, [sessionId]);

  const value = {
    sessionId,
    getProductReviews,
    getAverageRating,
    getUserReview,
    addReview,
    updateReview,
    deleteReview,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
