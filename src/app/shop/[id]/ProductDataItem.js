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

  // Collect all attributes
  const attributes = [];
  for (let i = 1; i <= 50; i++) {
    const name = product[`attribute_name_${i}`];
    const value = product[`attribute_value_${i}`];
    const uom = product[`attribute_value_uom_${i}`];
    if (name && value) {
      attributes.push({
        name,
        value: value + (uom ? ` ${uom}` : ""),
      });
    }
  }

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
      {attributes.length > 0 && (
        <div className="text-sm mt-2">
          <span className="font-semibold">Specifications:</span>
          <ul className="list-disc ml-6">
            {attributes.map((attr, i) => (
              <li key={i}><span className="font-medium">{attr.name}:</span> {attr.value}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm">
        Availability: <span className="text-gray2 font-semibold">In Stock</span>
      </p>
      {/* Quantity selector and Add to Cart button */}
      <div className="flex flex-col items-start mt-4">
        <div className="rounded-sm text-gray2 overflow-hidden border border-gray1 cursor-pointer flex mb-2">
          <p
            className="py-2 px-3 select-none"
            onClick={() => setQuantity(q => Math.max(q - 1, 1))}
          >
            -
          </p>
          <p className="py-2 px-3 w-[50px] text-center select-none">{quantity}</p>
          <p
            className="py-2 px-3 select-none"
            onClick={() => setQuantity(q => q + 1)}
          >
            +
          </p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-3 transition-all duration-300 ${added ? 'bg-green-600' : ''} ${error ? 'bg-red-600' : ''}`}
          onClick={async () => {
            setError(null);
            const result = await addToCart(product.sku || product.id, quantity);
            if (result.success) {
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            } else {
              setError(result.error || 'Failed to add to cart');
              setTimeout(() => setError(null), 3000);
            }
          }}
          disabled={loading || added}
        >
          {added ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Added
            </span>
          ) : error ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Error
            </span>
          ) : loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            'Add to cart'
          )}
        </button>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDataItem;
