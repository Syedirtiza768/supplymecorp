"use client";
import React, { useEffect, useState } from "react";
import Container2 from "@/components/custom/Container2";
import Sidebar from "@/components/custom/sidebar/Sidebar";
import ProductItem2 from "@/components/custom/home/ProductItem2";
import Link from "next/link";
import ProductItem3 from "@/components/custom/home/ProductItem3";
import { useSearchParams, useRouter } from "next/navigation";

const Shop = () => {
  // Define grid state at the top with other state variables
  const [grid, setGrid] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortBy = searchParams.get("sortBy") || "id";
  const sortOrder = searchParams.get("sortOrder") || "DESC";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (category) {
          setLoading(true);
          // Construct API URL using the parameters from the URL
          const apiUrl = `http://localhost:3001/api/products/filters/by-category/${category}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

          console.log("Fetching from API URL:", apiUrl);

          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
          }

          const data = await response.json();
          console.log("API Response:", data);
          console.log("Products:", data.items);
          setProducts(data.items || []);

          // Set pagination data
          if (data.meta) {
            setTotalItems(data.meta.totalItems || 0);
            setTotalPages(data.meta.totalPages || 1);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit, sortBy, sortOrder]);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    // Create new URL with updated page parameter
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    router.push(`/shop?${params.toString()}`);
  };

  // Function to generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Show maximum 5 page numbers

    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if needed
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add "First" page if not at the beginning
    if (startPage > 1) {
      items.push(
        <Link
          key="first"
          href={`/shop?${new URLSearchParams({
            ...Object.fromEntries(searchParams),
            page: "1",
          })}`}
          className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 border border-gray-300"
        >
          First
        </Link>
      );
    }

    // Add previous button
    if (page > 1) {
      items.push(
        <button
          key="prev"
          onClick={() => handlePageChange(page - 1)}
          className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 border border-gray-300"
        >
          &lt;
        </button>
      );
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${
            i === page
              ? "bg-white text-[#5D4037] border-2 border-[#5D4037] font-semibold"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          } py-2 px-4 rounded-md`}
        >
          {i}
        </button>
      );
    }

    // Add next button
    if (page < totalPages) {
      items.push(
        <button
          key="next"
          onClick={() => handlePageChange(page + 1)}
          className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 border border-gray-300"
        >
          &gt;
        </button>
      );
    }

    // Add "Last" page if not at the end
    if (endPage < totalPages) {
      items.push(
        <Link
          key="last"
          href={`/shop?${new URLSearchParams({
            ...Object.fromEntries(searchParams),
            page: totalPages.toString(),
          })}`}
          className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 border border-gray-300"
        >
          Last
        </Link>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="mb-20">
      {/* Page Title Section */}
      <div className="text-center py-10">
        <h2 className="font-bold text-2xl">Shop</h2>
        <p className="text-gray2 text-sm">
          Home <span className="tracking-[-2px]">&gt;&gt;</span> Shop{" "}
          {category && (
            <>
              <span className="tracking-[-2px]">&gt;&gt;</span> {category}
            </>
          )}
        </p>
      </div>

      {/* Product Categories Section */}
      <Container2
        headingTitle={"Product Categories"}
        gridView={grid}
        setGridView={setGrid}
      >
        <div className="w-full min-h-[700px] flex">
          <div className="w-[40%] lg:w-[25%] ">
            <Sidebar />
          </div>
          <div className="w-[60%] lg:w-[75%]">
            {products.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <p className="text-xl text-gray-500 mb-4">
                    No products found
                  </p>
                  <p className="text-gray-400">
                    Try selecting a different category or check back later
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="mb-4 text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1}-
                  {Math.min(page * limit, totalItems)} of {totalItems} products
                </div>

                {/* List style 3 items in row */}
                {grid === true ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                    {products.map((product) => (
                      <ProductItem2
                        key={product.id || product.sku}
                        img={
                          product.itemImage2 ||
                          product.itemImage1 ||
                          "/images/shop/no-image.png"
                        }
                        price={product.price || 59.99}
                        title={
                          product.onlineTitleDescription ||
                          product.brandName ||
                          "Product Name"
                        }
                        rating={4}
                        discount={product.discount}
                        oldPrice={product.oldPrice}
                        url={`/product/${product.id || product.sku}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 ">
                    {products.map((product) => (
                      <ProductItem3
                        key={product.id || product.sku}
                        id={product.id || product.sku}
                        img={
                          product.itemImage2 ||
                          product.itemImage1 ||
                          "/images/shop/no-image.jpeg"
                        }
                        title={
                          product.onlineTitleDescription ||
                          product.brandName ||
                          "Product Name"
                        }
                        rating={4} // Default rating as it's not in the API response
                        description={
                          product.onlineLongDescription ||
                          "No description available."
                        }
                        url={`/product/${product.id || product.sku}`}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center py-8 space-x-2">
                    {generatePaginationItems()}
                  </div>
                )}

                {/* Page information */}
                <div className="text-center text-sm text-gray-500 mt-2">
                  Page {page} of {totalPages}
                </div>
              </>
            )}
          </div>
        </div>
      </Container2>
    </div>
  );
};

export default Shop;
