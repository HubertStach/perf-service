import Link from "next/link";
import { db } from "~/server/db";

export default async function Home() {
  const products = await db.product.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Katalog produktów</h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-40 w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-1 p-4">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="mt-auto text-lg font-bold text-indigo-600">
                {(product.priceCents / 100).toFixed(2)} zł
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
