"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import Link from "next/link";

const WishlistIcon = ({ color = "#fff" }) => {
  const { wishlistCount } = useWishlist();

  return (
    <Link href="/wishlist" className="relative">
      <button className="relative p-2 hover:opacity-80 transition-opacity">
        <Heart size={28} className={`text-[${color}]`} style={{ color }} />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {wishlistCount}
          </span>
        )}
      </button>
    </Link>
  );
};

export default WishlistIcon;
