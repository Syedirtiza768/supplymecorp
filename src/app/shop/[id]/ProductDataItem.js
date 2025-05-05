"use client";
import React, { useState } from "react";
import Rating from "@/components/custom/Rating";

const ProductDataItem = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-xl font-semibold text-gray2">Impact Wrench</h2>
      <div className="flex items-center gap-3 border-b border-gray1 pb-3">
        <Rating rating={4} />
        <p className="text-sm text-gray2">1 reviews</p>
      </div>

      <p className="mt-3  text-sm">
        Brand: <span className="text-gray2 font-semibold">Hewlett Packard</span>
      </p>
      <p className="text-sm">
        Product Code:{" "}
        <span className="text-gray2 font-semibold">Product 120</span>
      </p>
      <p className="text-sm">
        Reward Points: <span className="text-gray2 font-semibold">200</span>
      </p>
      <p className="text-sm">
        Availability: <span className="text-gray2 font-semibold">In Stock</span>
      </p>
      <p className="py-3 font-bold text-red text-lg">$99.00</p>

      <div className="flex flex-col gap-5 lg:flex-row items-start">
        <div className="rounded-sm text-gray2 overflow-hidden border border-gray1 cursor-pointer flex ">
          <p
            className="py-2 px-3"
            onClick={() => (quantity == 0 ? 0 : setQuantity(quantity - 1))}
          >
            -
          </p>
          <p className="py-2 px-3  w-[50px] text-center">{quantity}</p>
          <p className="py-2 px-3" onClick={() => setQuantity(quantity + 1)}>
            +
          </p>
        </div>
        <button className="bg-first py-2 px-5 rounded-md hover:opacity-80 text-white self-start md:px-10">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDataItem;
