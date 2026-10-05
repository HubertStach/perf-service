import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyPassword } from "~/lib/auth";
import { db } from "~/server/db";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ id: user.id, email: user.email });
}
