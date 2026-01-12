"use client";

import dynamic from "next/dynamic";

const FeaturedFlipbook = dynamic(
  () => import("@/components/FeaturedFlipbook").then((m) => m.FeaturedFlipbook),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 520px)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading catalog...</p>
        </div>
      </div>
    ),
  }
);

export default function FeaturedFlipbookClient() {
  return <FeaturedFlipbook />;
}
