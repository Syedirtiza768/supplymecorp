"use client";
// This component is used in home and shop page for showing products in large size

import { useRouter } from "next/navigation";
import Image from "next/image";
import Rating from "../Rating";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WishlistButton from "../WishlistButton";

const ProductItem2 = ({
  title,
  price,
  oldPrice,
  rating,
  img,
  discount,
  link,
  url,
  id,
  hideButton,
  hidePrice,
}) => {
  const router = useRouter();

  return (
    (link || url) ? (
      <Link href={link || url} className="block min-h-[450px] group" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="relative w-full h-full min-h-[450px] p-6 flex flex-col border-2 border-gray-200 rounded-xl cursor-pointer hover:shadow-2xl hover:border-primary/30 transition-all duration-300 bg-white">
          {discount && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                -{discount}%
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={id} iconSize={20} />
          </div>
          <div className="w-full aspect-square flex items-center justify-center mb-4 bg-gray-50 rounded-lg p-4 relative">
            <Image
              src={img || "/images/products/default.png"}
              alt={title || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-auto w-full flex flex-col items-center gap-3">
            <h3 className="text-gray-800 font-semibold text-center w-full px-2 line-clamp-2 min-h-[3em] leading-snug group-hover:text-primary transition-colors">{title}</h3>
            {!hidePrice && (
              <div className="flex items-center gap-3 w-full justify-center">
                {oldPrice && oldPrice > 0 && (
                  <span className="text-gray-400 line-through text-sm">${Number(oldPrice).toFixed(2)}</span>
                )}
                {price && price > 0 ? (
                  <span className="text-2xl font-bold text-primary">${Number(price).toFixed(2)}</span>
                ) : (
                  <span className="text-gray-500 text-sm">Contact for pricing</span>
                )}
              </div>
            )}
            <Button className="w-full bg-primary hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all" onClick={(e) => { e.preventDefault(); window.location.href = link || url; }}>
              View Details
            </Button>
          </div>
        </div>
      </Link>
    ) : (
      <div className="relative w-full h-full min-h-[450px] p-6 flex flex-col border-2 border-gray-200 rounded-xl bg-white hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
        {discount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
              -{discount}%
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={id} iconSize={20} />
        </div>
        <div className="w-full aspect-square flex items-center justify-center mb-4 bg-gray-50 rounded-lg p-4 relative">
          <Image
            src={img || "/images/products/default.png"}
            alt={title || "Product"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mt-auto w-full flex flex-col items-center gap-3">
          <h3 className="text-gray-800 font-semibold text-center w-full px-2 line-clamp-2 min-h-[3em] leading-snug">{title}</h3>
          {!hidePrice && (
            <div className="flex items-center gap-3 w-full justify-center">
              {oldPrice && (
                <span className="text-gray-400 line-through text-sm">${oldPrice}</span>
              )}
              <span className="text-2xl font-bold text-primary">${price}</span>
            </div>
          )}
          <Button className="w-full bg-primary hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all" disabled={hideButton === true}>
            View Details
          </Button>
        </div>
      </div>
    )
  );
};

export default ProductItem2;
