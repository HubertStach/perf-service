import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";

const SESSION_COOKIE = "session";

export function hashPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  return { passwordHash, passwordSalt };
}

export function verifyPassword(
  password: string,
  passwordHash: string,
  passwordSalt: string,
) {
  const candidate = scryptSync(password, passwordSalt, 64);
  const stored = Buffer.from(passwordHash, "hex");
  return (
    candidate.length === stored.length && timingSafeEqual(candidate, stored)
  );
}

function sign(userId: string) {
  const mac = createHmac("sha256", env.SESSION_SECRET)
    .update(userId)
    .digest("hex");
  return `${userId}.${mac}`;
}

function unsign(token: string) {
  const [userId, mac] = token.split(".");
  if (!userId || !mac) return null;
  const expected = createHmac("sha256", env.SESSION_SECRET)
    .update(userId)
    .digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

export async function createSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSessionUserId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return unsign(token);
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
}
