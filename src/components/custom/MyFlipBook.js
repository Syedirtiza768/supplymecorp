"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function MyFlipBook() {
  const bookRef = useRef(null);

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const res = await fetch("/api/flipbook/images");
        if (!res.ok) throw new Error("Failed to fetch images");
        let files = await res.json();
        // Sort files numerically by page number (e.g., 1.jpg, 2.jpg, 10.jpg)
        files = files.sort((a, b) => {
          const getNum = (name) => {
            const match = name.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };
          return getNum(a) - getNum(b);
        });
        setPages(files.map((filename) => `/images/flipbook/${filename}`));
      } catch (err) {
        setError("Failed to load flipbook images");
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">Loading flipbook...</div>;
  }
  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-red-600">{error}</div>;
  }
  if (!pages.length) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">No flipbook images found.</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <HTMLFlipBook
        width={350}
        height={500}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={false}
        className="shadow-xl"
        ref={bookRef}
      >
        {pages.map((src, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-full h-full bg-white"
            style={{ minHeight: 0, minWidth: 0 }}
          >
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow"
              style={{ width: '100%', height: '100%', display: 'block', margin: 'auto' }}
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
