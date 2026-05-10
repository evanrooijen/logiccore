import type { WorldData } from "@logiccore/world";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const generatedWorldsTable = sqliteTable("generated_worlds", {
  id: integer().primaryKey({ autoIncrement: true }),
  payload: text("payload", { mode: "json" }).$type<WorldData>().notNull(),
});
