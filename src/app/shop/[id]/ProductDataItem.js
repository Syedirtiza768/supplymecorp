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

  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-xl font-semibold text-gray2">
        {product.onlineTitleDescription || "Product Name"}
      </h2>
      {/* <div className="flex items-center gap-3 border-b border-gray1 pb-3">
        <Rating rating={4} />
        <p className="text-sm text-gray2">1 reviews</p>
      </div> */}

      <p className="mt-3 text-sm">
        Brand:{" "}
        <span className="text-gray2 font-semibold">
          {product.brandName || "N/A"}
        </span>
      </p>
      <p className="text-sm">
        Product Code:{" "}
        <span className="text-gray2 font-semibold">
          {product.sku || product.id || "N/A"}
        </span>
      </p>

      {/* Add product attributes if available */}
      {product.attribute_name_1 && product.attribute_value_1 && (
        <p className="text-sm">
          {product.attribute_name_1}:{" "}
          <span className="text-gray2 font-semibold">
            {product.attribute_value_1}
          </span>
          {product.attribute_value_uom_1 && ` ${product.attribute_value_uom_1}`}
        </p>
      )}

      {product.attribute_name_2 && product.attribute_value_2 && (
        <p className="text-sm">
          {product.attribute_name_2}:{" "}
          <span className="text-gray2 font-semibold">
            {product.attribute_value_2}
          </span>
          {product.attribute_value_uom_2 && ` ${product.attribute_value_uom_2}`}
        </p>
      )}

      {product.attribute_name_3 && product.attribute_value_3 && (
        <p className="text-sm">
          {product.attribute_name_3}:{" "}
          <span className="text-gray2 font-semibold">
            {product.attribute_value_3}
          </span>
          {product.attribute_value_uom_3 && ` ${product.attribute_value_uom_3}`}
        </p>
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
