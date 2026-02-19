import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // koneksi untuk migrate/studio taruh di sini
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
