"use client";

import React from 'react';

interface Product {
    id: string;
    title: string;
    image: string;
}

interface ProductsGridProps {
    products?: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
    // Default products for demo if none provided
    const displayProducts = products || [
        { id: "9032749", title: "Starfrit Simplicity Series 33020 Fry Pan, 10 in Dia, Aluminum Pan, Black Pan, Ergonomic Handle", image: "https://images.orgill.com/websmall/10031/9032749.jpg" },
        { id: "7520653", title: "DEWALT DWMT74212 Socket Set, Specifications: 3/8 in Drive Size, Includes: (2) 8 mm Hex Bit", image: "https://images.orgill.com/websmall/10025/7520653.jpg" },
        { id: "4534699", title: "Midwest Fastener 53755 Screw, 3/8 in Thread, 5 in L, Hex Drive, 25 PK", image: "https://images.orgill.com/websmall/10026/4534699.jpg" },
    ];

    return (
        <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {displayProducts.map((product) => (
                <a
                    key={product.id}
                    className="block h-full group"
                    href={`/shop/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <div className="relative w-full h-full p-5 flex flex-col border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                        {/* Wishlist Button */}
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                className="flex items-center justify-center gap-2 transition-all hover:scale-110"
                                title="Add to wishlist"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Add wishlist logic here
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-heart transition-colors text-gray-400 hover:text-red-500"
                                >
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Product Image */}
                        <div className="w-full aspect-square flex items-center justify-center mb-4">
                            <img
                                alt={product.title}
                                className="max-w-full max-h-full object-contain"
                                src={product.image}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="mt-auto w-full flex flex-col items-center gap-3">
                            <h3 className="text-gray-700 text-center w-full px-2 line-clamp-2 min-h-[3em]">
                                {product.title}
                            </h3>
                            <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full bg-primary hover:bg-primary/90 text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/shop/${product.id}`;
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}

export default ProductsGrid;
