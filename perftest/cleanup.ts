import { db } from "~/server/db";

const result = await db.user.deleteMany({
  where: { email: { startsWith: "perftest-" } },
});

console.log(`Usunięto ${result.count} testowych użytkowników.`);
await db.$disconnect();
