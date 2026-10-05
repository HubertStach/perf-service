import { redirect } from "next/navigation";
import { getSessionUserId } from "~/lib/auth";
import { db } from "~/server/db";
import { CartItems } from "~/app/_components/cart-items";

export default async function CartPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const items = await db.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Koszyk</h1>
      <CartItems initialItems={items} />
    </main>
  );
}
