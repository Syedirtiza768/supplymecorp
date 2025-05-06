"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Create a separate component that uses the hook
const NotFoundContent = () => {
  const searchParams = useSearchParams();

  // Rest of your component logic
  return (
    <div>
      <h1>Page Not Found</h1>
      {/* Your 404 page content */}
    </div>
  );
};

// Main component with Suspense wrapper
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
