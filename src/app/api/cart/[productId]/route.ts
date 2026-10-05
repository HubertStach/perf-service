import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "~/lib/auth";
import { db } from "~/server/db";

const bodySchema = z.object({ quantity: z.number().int().positive() });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { productId } = await params;

  const item = await db.cartItem
    .update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: parsed.data.quantity },
      include: { product: true },
    })
    .catch(() => null);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await params;
  await db.cartItem
    .delete({ where: { userId_productId: { userId, productId } } })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
