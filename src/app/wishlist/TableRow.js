"use client";
import React, { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";

const TableRow = ({ item }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const price = parseFloat(item.currentPrice || item.price_snapshot || 0);
  const imageUrl = item.orgillImages?.[0] || "/images/products/product1.jpg";
  const productTitle = item.title || item.onlineTitleDescription || "Product";
  const brandName = item.brandName || "";

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromWishlist(item.productId);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(item.productId, 1);
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(item.productId);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <tr>
      <td className="border border-gray1 text-center w-[120px]">
        <Link href={`/shop/product/${item.productId}`}>
          <img
            src={imageUrl}
            alt={productTitle}
            className="h-[100px] w-full object-contain cursor-pointer hover:opacity-80"
          />
        </Link>
      </td>
      <td className="py-2 border border-gray1 text-center mx-auto">
        <Link href={`/shop/product/${item.productId}`}>
          <p className="text-sm font-semibold hover:text-blue-600 cursor-pointer">
            {productTitle}
          </p>
        </Link>
        {brandName && (
          <p className="text-xs text-gray-500 mt-1">{brandName}</p>
        )}
      </td>
      <td className="py-2 border border-gray1 text-center">
        <div>
          <p className="font-semibold">${price.toFixed(2)}</p>
          {item.price_snapshot && parseFloat(item.price_snapshot) !== price && (
            <p className="text-xs text-gray-500 line-through">
              ${parseFloat(item.price_snapshot).toFixed(2)}
            </p>
          )}
        </div>
      </td>
      <td className="py-2 border border-gray1 text-center">
        <span className="text-green-600 text-sm">In Stock</span>
      </td>
      <td className="py-2 border border-gray1 text-center">
        <button
          className="bg-black text-white py-2 px-4 rounded-sm hover:opacity-80 disabled:opacity-50 flex items-center gap-2 mx-auto"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <ShoppingCart size={16} />
          {isAddingToCart ? "Adding..." : "Add To Cart"}
        </button>
      </td>
      <td className="py-2 border border-gray1 text-center">
        <button
          className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
          onClick={handleRemove}
          disabled={isRemoving}
          title="Remove from wishlist"
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
