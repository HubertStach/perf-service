"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CartItem, Product } from "../../../generated/prisma";

type Item = CartItem & { product: Product };

export function CartItems({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return removeItem(productId);
    const res = await fetch(`/api/cart/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    }
  }

  async function removeItem(productId: string) {
    const res = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      router.refresh();
    }
  }

  if (items.length === 0) {
    return <p className="text-gray-500">Koszyk jest pusty.</p>;
  }

  const totalCents = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border bg-white p-4"
        >
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-16 w-16 rounded object-cover"
          />
          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>
            <p className="text-sm text-gray-500">
              {(item.product.priceCents / 100).toFixed(2)} zł
            </p>
          </div>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.productId, Number(e.target.value))
            }
            className="w-16 rounded border px-2 py-1 text-center"
          />
          <button
            onClick={() => removeItem(item.productId)}
            className="text-sm text-red-600 hover:underline"
          >
            Usuń
          </button>
        </div>
      ))}
      <div className="flex justify-end border-t pt-4 text-xl font-bold">
        Suma: {(totalCents / 100).toFixed(2)} zł
      </div>
    </div>
  );
}
