import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("~/server/db", () => ({ db: {} }));

const { hashPassword, verifyPassword } = await import("./auth");

describe("hashPassword / verifyPassword", () => {
  it("verifies the correct password", async () => {
    const { passwordHash, passwordSalt } = await hashPassword("correct-horse");
    expect(
      await verifyPassword("correct-horse", passwordHash, passwordSalt),
    ).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const { passwordHash, passwordSalt } = await hashPassword("correct-horse");
    expect(
      await verifyPassword("wrong-password", passwordHash, passwordSalt),
    ).toBe(false);
  });

  it("uses a different salt on every call", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a.passwordSalt).not.toBe(b.passwordSalt);
    expect(a.passwordHash).not.toBe(b.passwordHash);
  });
});
