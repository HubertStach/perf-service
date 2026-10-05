import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

const result = await db.user.deleteMany({
  where: { email: { startsWith: "perftest-" } },
});

console.log(`Usunięto ${result.count} testowych użytkowników.`);
await db.$disconnect();
