// app/flipbook/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
// import type HTMLFlipBookType from "react-pageflip";

// Dynamically import the flipbook (disable SSR)
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function MyFlipBook() {
  const bookRef = useRef(null);

  const pages = [
    "Welcome to the Flipbook!",
    "This is page 2.",
    "Here's page 3.",
    "Almost done on page 4.",
    "Thanks for flipping!",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">My Flipbook</h1>

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
        {pages.map((text, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-xl font-medium bg-white border border-gray-300 p-4"
          >
            {text}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
