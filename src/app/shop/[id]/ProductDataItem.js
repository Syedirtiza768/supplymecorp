"use client";
import React, { useState } from "react";
import Rating from "@/components/custom/Rating";

const ProductDataItem = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

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
      <p className="py-3 font-bold text-red text-lg">
        ${product.price || "Contact for pricing"}
      </p>

      {/* <div className="flex flex-col gap-5 lg:flex-row items-start">
        <div className="rounded-sm text-gray2 overflow-hidden border border-gray1 cursor-pointer flex ">
          <p
            className="py-2 px-3"
            onClick={() => (quantity <= 1 ? 1 : setQuantity(quantity - 1))}
          >
            -
          </p>
          <p className="py-2 px-3 w-[50px] text-center">{quantity}</p>
          <p className="py-2 px-3" onClick={() => setQuantity(quantity + 1)}>
            +
          </p>
        </div>
        <button className="bg-first py-2 px-5 rounded-md hover:opacity-80 text-white self-start md:px-10">
          Add to cart
        </button>
      </div> */}
    </div>
  );
};

export default ProductDataItem;
