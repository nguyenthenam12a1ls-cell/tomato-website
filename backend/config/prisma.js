import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const globalForPrisma = globalThis;

let prismaInstance = globalForPrisma.prisma ?? null;

if (!prismaInstance) {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (err) {
    console.error("Prisma client initialization failed:", err.message || err);
  }
}

export const prisma = prismaInstance;
