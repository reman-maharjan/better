import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in your .env file!");
}

// Optional: Log the URL (without password) to verify it’s loaded
const safeUrl = process.env.DATABASE_URL.replace(/:(.*)@/, ":*****@");
console.log("Using database URL:", safeUrl);

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
