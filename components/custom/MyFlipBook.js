"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function MyFlipBook() {
  const bookRef = useRef(null);

  const pages = [
    "/images/flipbook/book1.jpg",
    "/images/flipbook/book2.jpg",
    "/images/flipbook/book3.jpg",
    "/images/flipbook/book4.jpg",
    "/images/flipbook/book5.jpg",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
      {/* <h1 className="text-3xl font-bold mb-6">My Flipbook</h1> */}

      <HTMLFlipBook
        width={350}
        height={500}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={true}
        className="shadow-xl"
        ref={bookRef}
      >
        {pages.map((src, index) => (
          <div key={index} className="w-full h-full overflow-hidden">
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
