"use client";
import React, { useState } from "react";
import Container1 from "@/components/custom/Container1";
import CheckoutLeftPortion from "./CheckoutLeftPortion";
import CheckoutRightPortion from "./CheckoutRightPortion";

const Shop = () => {
  const [cartItems, setCartItems] = useState(true);

  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Checkout</h2>
        <p className="text-gray2 text-sm">
          Cart
          <span className="tracking-[-2px]">&gt;&gt;</span> Information
          <span className="tracking-[-2px]">&gt;&gt;</span> Shipping
          <span className="tracking-[-2px]">&gt;&gt;</span> Payment
        </p>
      </div>

      {/* Product Categories Section */}
      <Container1 headingTitle={"Checkout"}>
        {/* { cartItems ? <CheckoutLeftPortion /> : <CheckoutRightPortion /> }        */}
        <div className="w-[100%] min-h-[450px] flex gap-10 flex-col-reverse lg:flex-row lg:gap-0">
          <CheckoutLeftPortion />
          <CheckoutRightPortion />
        </div>
      </Container1>
    </div>
  );
};

export default Shop;
