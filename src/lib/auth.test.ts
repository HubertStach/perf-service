import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("~/server/db", () => ({ db: {} }));

const { hashPassword, verifyPassword } = await import("./auth");

describe("hashPassword / verifyPassword", () => {
  it("verifies the correct password", () => {
    const { passwordHash, passwordSalt } = hashPassword("correct-horse");
    expect(verifyPassword("correct-horse", passwordHash, passwordSalt)).toBe(
      true,
    );
  });

  it("rejects an incorrect password", () => {
    const { passwordHash, passwordSalt } = hashPassword("correct-horse");
    expect(verifyPassword("wrong-password", passwordHash, passwordSalt)).toBe(
      false,
    );
  });

  it("uses a different salt on every call", () => {
    const a = hashPassword("same-password");
    const b = hashPassword("same-password");
    expect(a.passwordSalt).not.toBe(b.passwordSalt);
    expect(a.passwordHash).not.toBe(b.passwordHash);
  });
});
