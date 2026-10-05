import { randomBytes, scryptSync } from "crypto";
import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient();

const categories = [
  "Kubek",
  "T-shirt",
  "Plecak",
  "Słuchawki",
  "Lampka",
  "Notatnik",
  "Butelka",
  "Powerbank",
];

function hashPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  return { passwordHash, passwordSalt };
}

async function main() {
  await db.cartItem.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  const products = Array.from({ length: 40 }, (_, i) => {
    const category = categories[i % categories.length];
    const name = `${category} #${i + 1}`;
    return {
      name,
      description: `Przykładowy produkt testowy: ${name}. Używany do testów wydajnościowych.`,
      priceCents: 1000 + ((i * 137) % 9000),
      imageUrl: `https://picsum.photos/seed/perf-shop-${i}/400/300`,
      stock: 50 + (i % 10) * 10,
    };
  });
  await db.product.createMany({ data: products });

  const { passwordHash, passwordSalt } = hashPassword("password123");
  await db.user.create({
    data: { email: "demo@example.com", passwordHash, passwordSalt },
  });

  console.log(`Seeded ${products.length} products and 1 demo user.`);
  console.log("Login: demo@example.com / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
