import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { AddToCartButton } from "~/app/_components/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full rounded-lg object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
          <p className="mt-4 text-2xl font-bold text-indigo-600">
            {(product.priceCents / 100).toFixed(2)} zł
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Dostępnych: {product.stock}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </main>
  );
}
