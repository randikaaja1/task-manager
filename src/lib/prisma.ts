import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter, log: ["error", "warn"] });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;