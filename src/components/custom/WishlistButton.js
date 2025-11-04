"use client";
import React, { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

const WishlistButton = ({ productId, className = "", iconSize = 20, showText = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const inWishlist = isInWishlist(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 transition-all ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      } ${className}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={iconSize}
        className={`transition-colors ${
          inWishlist
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
      {showText && (
        <span className="text-sm">
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
