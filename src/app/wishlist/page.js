"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import Container1 from "@/components/custom/Container1";
import ItemSelected from "./ItemSelected";
import ItemNotSeleted from "./ItemNotSeleted";

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();
  const hasItems = wishlistItems && wishlistItems.length > 0;

  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Wishlist</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Favorites{" "}
        </p>
      </div>

      {/* Product Categories Section */}
      <Container1 headingTitle={`Favorites ${hasItems ? `(${wishlistItems.length})` : ''}`}>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading wishlist...</p>
          </div>
        ) : hasItems ? (
          <ItemSelected items={wishlistItems} />
        ) : (
          <ItemNotSeleted />
        )}
      </Container1>
    </div>
  );
};

export default WishlistPage;
