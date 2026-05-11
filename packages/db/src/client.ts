import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { relations } from "./schema/worlds";

export type AppDatabase = ReturnType<typeof getDb>;

function getDatabaseUrl(): string {
  const url = process.env.DB_FILE_NAME;

  if (!url) {
    throw new Error(
      "DB_FILE_NAME environment variable is not set (e.g. file:local.db)"
    );
  }

  return url;
}

export function getDb() {
  return drizzle({
    client: createClient({ url: getDatabaseUrl() }),
    relations,
  });
}
