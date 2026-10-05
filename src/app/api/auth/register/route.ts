import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, hashPassword } from "~/lib/auth";
import { db } from "~/server/db";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const { passwordHash, passwordSalt } = await hashPassword(password);
  const user = await db.user.create({
    data: { email, passwordHash, passwordSalt },
  });

  await createSession(user.id);
  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
