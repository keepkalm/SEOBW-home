import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Check if we're in a build environment or missing connection string
const isBuildTime = process.env.NODE_ENV === "production" && !connectionString;

// Create a placeholder client for build time, or real client for runtime
const queryClient = connectionString
  ? postgres(connectionString, {
      max: 10, // Maximum connections in pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
    })
  : postgres("postgresql://placeholder:placeholder@localhost:5432/placeholder", {
      max: 1,
    });

export const db = drizzle(queryClient, { schema });

// Export schema for use in other files
export { schema };

// Utility to check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!connectionString;
}

// Utility to safely run database operations
export async function withDatabase<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  if (!isDatabaseConfigured()) {
    console.warn("Database not configured, skipping operation");
    return fallback ?? null;
  }
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  }
}
