"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";

import ProductSlider2 from "./ProductsSlider2";
import ProductDataItem from "./ProductDataItem";
import TabComponent from "./TabComponent";
import Container1 from "@/components/custom/Container1";
import Sidebar from "@/components/custom/sidebar/Sidebar";
import ProductItem2 from "@/components/custom/home/ProductItem2";

const Shop = ({ params }) => {
  const [sliderImg, setSliderImg] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  params = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Get the product id from params
        const productId = params.id || params.sku;

        if (!productId) {
          throw new Error("Product ID not found in URL parameters");
        }

        // Fetch product data from API
        const response = await fetch(
          `http://localhost:3001/api/products/${productId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);

        // Set the default slider image to the first product image
        if (data.itemImage2) {
          setSliderImg(data.itemImage2);
        } else if (data.itemImage1) {
          setSliderImg(data.itemImage1);
        } else {
          setSliderImg("/images/products/product1.jpg"); // Fallback image
        }

        // Fetch related products (same category)
        if (data.categoryCode) {
          const relatedResponse = await fetch(
            `http://localhost:3001/api/products/filters/by-category/${data.categoryTitleDescription}?limit=4`
          );

          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current product
            const filteredProducts = relatedData.items
              ? relatedData.items.filter(
                  (item) => item.id !== data.id && item.sku !== data.sku
                )
              : [];
            // Limit to 4 products
            setRelatedProducts(filteredProducts.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, params.sku]);

  // Generate product images array for the slider
  const getProductImages = () => {
    const images = [];

    if (product) {
      // Add all available product images to the slider with unique identifiers
      if (product.itemImage1) {
        images.push({
          title: `${product.brandName || "Product"}-image-1`,
          img: product.itemImage1,
          quantity: "1",
          link: "#",
        });
      }

      if (product.itemImage2) {
        images.push({
          title: `${product.brandName || "Product"}-image-2`,
          img: product.itemImage2,
          quantity: "1",
          link: "#",
        });
      }

      if (product.itemImage3) {
        images.push({
          title: `${product.brandName || "Product"}-image-3`,
          img: product.itemImage3,
          quantity: "1",
          link: "#",
        });
      }

      if (product.itemImage4) {
        images.push({
          title: `${product.brandName || "Product"}-image-4`,
          img: product.itemImage4,
          quantity: "1",
          link: "#",
        });
      }
    }

    // If no images are available, use default images with unique titles
    if (images.length === 0) {
      return [
        {
          title: "Default-Product-1",
          img: "/images/products/product1.jpg",
          quantity: "1",
          link: "#",
        },
        {
          title: "Default-Product-2",
          img: "/images/products/product2.jpg",
          quantity: "1",
          link: "#",
        },
        {
          title: "Default-Product-3",
          img: "/images/products/product3.jpg",
          quantity: "1",
          link: "#",
        },
      ];
    }

    return images;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="font-bold text-xl mb-2">Loading...</h2>
          <p className="text-gray2">
            Please wait while we fetch product details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="font-bold text-xl mb-2">Error Loading Product</h2>
          <p className="text-red-500">{error}</p>
          <Link
            href="/shop"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Shop</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Shop{" "}
          <span className="tracking-[-2px]">&gt;&gt;</span>{" "}
          {product?.categoryTitleDescription || "Product Details"}{" "}
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
            {/* big image section */}
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[30%]">
                <img
                  src={sliderImg}
                  alt={product?.onlineTitleDescription || "Product Image"}
                  className="w-full object-contain md:h-[400px] border border-gray1 mb-10"
                />
                <ProductSlider2
                  data={getProductImages()}
                  setSliderImg={setSliderImg}
                />
              </div>
              {/* Item description section */}
              <div className="w-full pl-10 lg:w-[70%]">
                <ProductDataItem product={product} />
              </div>
            </div>
            {/* Tab section */}
            <div className="mt-10 lg:mt-20">
              <TabComponent product={product} />
            </div>

            {/* Related Products section */}
            {relatedProducts.length > 0 && (
              <div className="my-10 lg:my-20">
                <h3 className="text-xl font-bold text-black border-b border-gray1 pb-3">
                  RELATED PRODUCTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
                  {relatedProducts.map((relatedProduct, index) => (
                    <ProductItem2
                      key={`related-${
                        relatedProduct.id || relatedProduct.sku || index
                      }`}
                      id={relatedProduct.id || relatedProduct.sku}
                      img={
                        relatedProduct.itemImage2 ||
                        relatedProduct.itemImage1 ||
                        "/images/products/product1.jpg"
                      }
                      price={relatedProduct.price || "Contact for price"}
                      title={
                        relatedProduct.onlineTitleDescription ||
                        relatedProduct.brandName ||
                        "Related Product"
                      }
                      rating={4}
                      url={`/shop/${relatedProduct.id || relatedProduct.sku}`}
                    />
                  ))}
                  {/* Fill with placeholder products if we don't have enough related products */}
                  {/* {relatedProducts.length < 4 &&
                    Array(4 - relatedProducts.length)
                      .fill(null)
                      .map((_, index) => (
                        <ProductItem2
                          key={`placeholder-${index}`}
                          img={"/images/products/product1.jpg"}
                          price={"Contact for price"}
                          title={"Similar Product"}
                          rating={5}
                          url="#"
                        />
                      ))} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container1>
    </div>
  );
};

export default Shop;
