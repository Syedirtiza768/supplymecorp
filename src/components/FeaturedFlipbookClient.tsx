"use client";

import dynamic from "next/dynamic";

const FeaturedFlipbook = dynamic(
  () => import("@/components/FeaturedFlipbook").then((m) => m.FeaturedFlipbook),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center">Loading catalog...</div>
    ),
  }
);

export default function FeaturedFlipbookClient() {
  return <FeaturedFlipbook />;
}
