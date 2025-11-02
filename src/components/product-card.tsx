"use client";
import { useState } from "react";
import useSWR from "swr";
import { addToCart } from "@/lib/cart";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(r => r.json());

export default function ProductCard({ product }: { product: any }) {
  const [adding, setAdding] = useState(false);
  const { mutate } = useSWR("/api/me/cart", fetcher);

  async function onAdd() {
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      await mutate();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Add to cart failed");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="rounded-xl border p-3">
      {/* existing UI kept */}
      <button onClick={onAdd} disabled={adding} className="mt-3 w-full rounded bg-black px-3 py-2 text-white">
        {adding ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
}
