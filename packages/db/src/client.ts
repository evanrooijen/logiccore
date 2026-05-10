import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

import * as schema from "./schema/index";

export type AppDatabase = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  logiccoreDb?: AppDatabase;
};

function getDatabaseUrl(): string {
  const url = process.env.DB_FILE_NAME;

  if (!url) {
    throw new Error(
      "DB_FILE_NAME environment variable is not set (e.g. file:local.db)"
    );
  }

  return url;
}

/** LibSQL Drizzle database (singleton on `globalThis` in dev). */
export function getDb(): AppDatabase {
  if (!globalForDb.logiccoreDb) {
    globalForDb.logiccoreDb = drizzle({
      client: createClient({ url: getDatabaseUrl() }),
      schema,
    });
  }

  return globalForDb.logiccoreDb;
}
