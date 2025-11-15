"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Rating from "@/components/custom/Rating";

const ProductDataItem = ({ product }) => {

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart, loading } = useCart();
  if (!product) return <div>Loading product information...</div>;

  // Collect all feature bullets
  const featureBullets = [];
  for (let i = 1; i <= 10; i++) {
    const bullet = product[`onlineFeatureBullet${i}`] || product[`online_feature_bullet_${i}`];
    if (bullet) featureBullets.push(bullet);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-xl font-semibold text-gray2">
        {product.onlineTitleDescription || product.title || "Product Name"}
      </h2>
      <p className="mt-3 text-sm">
        Brand: <span className="text-gray2 font-semibold">{product.brandName || product.brand || "N/A"}</span>
      </p>
      <p className="text-sm">
        Model: <span className="text-gray2 font-semibold">{product.modelNumber || product.model || "N/A"}</span>
      </p>
      <p className="text-sm">
        UPC: <span className="text-gray2 font-semibold">{product.upcCode || product.upc || "N/A"}</span>
      </p>
      <p className="text-sm">
        Product Code: <span className="text-gray2 font-semibold">{product.sku || product.id || "N/A"}</span>
      </p>
      {product.application && (
        <p className="text-sm">Application: <span className="text-gray2 font-semibold">{product.application}</span></p>
      )}
      {product.warranty && (
        <p className="text-sm">Warranty: <span className="text-gray2 font-semibold">{product.warranty}</span></p>
      )}
      {featureBullets.length > 0 && (
        <div className="text-sm mt-2">
          <span className="font-semibold">Features:</span>
          <ul className="list-disc ml-6">
            {featureBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm">
        Availability: <span className="text-gray2 font-semibold">In Stock</span>
      </p>
      {/* Quantity selector removed as requested. */}
      {/* Add to Cart button and error will be rendered in the main product page below price */}
    </div>
  );
};

export default ProductDataItem;
