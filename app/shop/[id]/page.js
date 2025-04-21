"use client";
import React, { useState } from "react";

import Link from "next/link";

import ProductSlider2 from "./ProductsSlider2";
import ProductDataItem from "./ProductDataItem";
import TabComponent from "./TabComponent";
import Container1 from "@/components/custom/Container1";
import Sidebar from "@/components/custom/sidebar/Sidebar";
import ProductItem2 from "@/components/custom/home/ProductItem2";

const Shop = ({ params }) => {
  const [sliderImg, setSliderImg] = useState("/images/products/product1.jpg");
  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Shop</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Shop{" "}
          <span className="tracking-[-2px]">&gt;&gt;</span> Impact Wrench{" "}
        </p>
      </div>

      {/* Product Categories Section */}
      <Container1 headingTitle={"Product Categories"}>
        <div className="w-full min-h-[700px] flex">
          <div className="w-[40%] lg:w-[25%] ">
            <Sidebar />
          </div>
          {/* right section code */}
          <div className="w-[60%] lg:w-[75%]">
            {/* big image sectoin */}
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[30%]">
                <img
                  src={sliderImg}
                  alt=""
                  className="w-full object-contain md:h-[400px] border border-gray1 mb-10"
                />
                <ProductSlider2
                  data={[
                    {
                      title: "Tulip Block1",
                      img: "/images/products/product1.jpg",
                      quantity: "120",
                      link: "#",
                    },
                    {
                      title: "Tulip Block2",
                      img: "/images/products/product2.jpg",
                      quantity: "120",
                      link: "#",
                    },
                    {
                      title: "Tulip Block3",
                      img: "/images/products/product3.jpg",
                      quantity: "120",
                      link: "#",
                    },
                    {
                      title: "Tulip Block4",
                      img: "/images/products/product4.jpg",
                      quantity: "120",
                      link: "#",
                    },
                    {
                      title: "Tulip Block5",
                      img: "/images/products/product5.jpg",
                      quantity: "120",
                      link: "#",
                    },
                  ]}
                  setSliderImg={setSliderImg}
                />
              </div>
              {/* Item description section */}
              <div className="w-full pl-10 lg:w-[70%]  ">
                <ProductDataItem />
              </div>
            </div>
            {/* Tab section */}
            <div className="mt-10 lg:mt-20">
              <TabComponent />
            </div>

            {/* Related Products section */}
            <div className="my-10 lg:my-20">
              <h3 className="text-xl font-bold text-black border-b border-gray1 pb-3">
                RELATED PRODUCTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
                <ProductItem2
                  img={"/images/products/product1.jpg"}
                  price={"95.00"}
                  title={"Cordless Drill"}
                  rating={5}
                  url="#"
                />
                <ProductItem2
                  img={"/images/products/product1.jpg"}
                  price={"95.00"}
                  title={"Cordless Drill"}
                  rating={5}
                  url="#"
                />
                <ProductItem2
                  img={"/images/products/product1.jpg"}
                  price={"95.00"}
                  title={"Cordless Drill"}
                  rating={5}
                  url="#"
                />
                <ProductItem2
                  img={"/images/products/product1.jpg"}
                  price={"95.00"}
                  title={"Cordless Drill"}
                  rating={5}
                  url="#"
                />
              </div>
            </div>
          </div>
        </div>
      </Container1>
    </div>
  );
};

export default Shop;
