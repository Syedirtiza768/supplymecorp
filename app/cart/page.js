"use client";
import React, { useState } from "react";
import Container2 from "@/components/custom/Container2";
import Sidebar from "@/components/custom/sidebar/Sidebar";
import ProductItem2 from "@/components/custom/home/ProductItem2";
import Link from "next/link";
import ProductItem3 from "@/components/custom/home/ProductItem3";
import Container1 from "@/components/custom/Container1";
import TableRow from "./TableRow";
import ItemSelected from "./ItemSelected";
import ItemNotSeleted from "./ItemNotSeleted";

const Shop = () => {
  const [cartItems, setCartItems] = useState(true);

  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Cart</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Cart{" "}
        </p>
      </div>

      {/* Product Categories Section */}
      <Container1 headingTitle={"Your Shopping Cart"}>
        {cartItems ? <ItemSelected /> : <ItemNotSeleted />}
      </Container1>
    </div>
  );
};

export default Shop;
