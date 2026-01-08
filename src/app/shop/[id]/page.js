"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";

import ProductSlider2 from "./ProductsSlider2";
import ProductDataItem from "./ProductDataItem";
import TabComponent from "./TabComponent";
import Container1 from "@/components/custom/Container1";
import Sidebar from "@/components/custom/sidebar/Sidebar";
import ProductItem2 from "@/components/custom/home/ProductItem2";
import { Button } from "@/components/ui/button";
import ReviewList from "@/components/review-list";
import AddToCartSection from './AddToCartSection';

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
        const productId = params.id || params.sku;
        if (!productId) throw new Error("Product ID not found in URL parameters");
        
        // Fetch product data with timeout (5 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const [standardRes, mergedRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, { signal: controller.signal }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/merged`, { signal: controller.signal })
        ]).catch(err => {
          if (err.name === 'AbortError') {
            console.warn('Product fetch timeout - falling back to cached data');
            return [null, null];
          }
          throw err;
        }).finally(() => clearTimeout(timeoutId));
        
        if (!standardRes?.ok || !mergedRes?.ok) {
          throw new Error(`Failed to fetch product: ${standardRes?.status || 'unknown'}`);
        }
        
        const standardText = await standardRes.text();
        const mergedText = await mergedRes.text();
        if (!standardText) throw new Error('No product data returned');
        if (!mergedText) throw new Error('No price data returned');
        
        let standardData, mergedData;
        try { standardData = JSON.parse(standardText); } catch (e) { throw new Error('Invalid product data received'); }
        try { mergedData = JSON.parse(mergedText); } catch (e) { throw new Error('Invalid price data received'); }
        
        // Use merged data for name, description, images, price, fallback to standard if needed
        const productData = {
          ...standardData,
          ...mergedData,
          price: mergedData.price != null ? mergedData.price : standardData.price,
        };
        setProduct(productData);
        
        // Set the default slider image to the first merged image if available
        if (mergedData.images && mergedData.images.length > 0) {
          setSliderImg(mergedData.images[0]);
        } else if (standardData.itemImage2) {
          setSliderImg(standardData.itemImage2);
        } else if (standardData.itemImage1) {
          setSliderImg(standardData.itemImage1);
        } else {
          setSliderImg("/images/products/product1.jpg");
        }
        
        // Fetch related products in parallel with main product (don't wait for it to complete)
        if (standardData.categoryCode) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/filters/by-category/${standardData.categoryCode}?limit=4`
          )
            .then(relatedResponse => {
              if (relatedResponse.ok) {
                return relatedResponse.json();
              }
              return null;
            })
            .then(relatedData => {
              if (!relatedData) return;
              let filteredProducts = relatedData.items
                ? relatedData.items.filter(
                    (item) => item.id !== standardData.id && item.sku !== standardData.sku
                  )
                : [];
              const seen = new Set();
              filteredProducts = filteredProducts.filter((item) => {
                const key = item.sku || item.id;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
              setRelatedProducts(filteredProducts.slice(0, 3));
            })
            .catch(err => {
              console.warn('Failed to fetch related products:', err);
              // Don't block main product display if related products fail
            });
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
    if (product && product.images && product.images.length > 0) {
      return product.images.map((img, idx) => ({
        title: `${product.brandName || product.brand || "Product"}-image-${idx + 1}`,
        img,
        quantity: "1",
        link: "#",
      }));
    }
    // Fallback to old logic if no merged images
    const images = [];
    if (product) {
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
    return null;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="font-bold text-xl mb-2">Error Loading Product</h2>
          <p className="text-red-500">{error}</p>
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
                {/* Product details */}
                <ProductDataItem product={product} />
                {/* Display the price or 'Contact for pricing' if price is null */}
                <p className="py-3 font-bold text-red text-lg">
                  {product && product.price != null ? `$${product.price}` : 'Contact for pricing'}
                </p>
                {/* Add to Cart button below price */}
                <AddToCartSection product={product} />

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
                <div className="flex flex-row gap-5 mt-5 pb-2 w-full justify-center">
                  {relatedProducts.map((relatedProduct, index) => (
                    <div key={`related-${relatedProduct.id || relatedProduct.sku}-${index}`} className="w-[300px] min-h-[auto] flex flex-col items-center justify-between bg-white rounded-lg shadow-sm" style={{border: 'none', boxSizing: 'border-box'}}>
                      <ProductItem2
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
                        hideButton={true}
                      />
                      <a
                        href={`/shop/${relatedProduct.id || relatedProduct.sku}`}
                        className="w-full flex justify-center mt-3"
                      >
                        <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-all">View Details</button>
                      </a>
                    </div>
                  ))}
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
