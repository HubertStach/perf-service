"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");

  async function addToCart() {
    setStatus("pending");
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("idle");
    router.push("/cart");
  }

  return (
    <button
      onClick={addToCart}
      disabled={status === "pending"}
      className="mt-6 rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {status === "pending" ? "Dodawanie..." : "Dodaj do koszyka"}
    </button>
  );
}
