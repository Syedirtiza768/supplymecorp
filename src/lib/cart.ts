export async function addToCart(productId: string, qty = 1) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cart`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, qty }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Add to cart failed (${res.status})`);
  return data;
}

export async function getCart() {
  const url = "/api/me/cart";
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load cart (${res.status})`);
  return res.json();
}
