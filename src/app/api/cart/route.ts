import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json(items);
}

const bodySchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { productId, quantity } = parsed.data;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const item = await db.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity },
    update: { quantity: { increment: quantity } },
    include: { product: true },
  });
  return NextResponse.json(item, { status: 201 });
}
