import { defineRelations } from "drizzle-orm";
import * as sq from "drizzle-orm/sqlite-core";

export const generatedWorldsTable = sq.sqliteTable("generated_worlds", {
  id: sq.integer().primaryKey({ autoIncrement: true }),
  seed: sq.integer(),
  size: sq.integer(),
  chunkSize: sq.integer(),
  chunksWide: sq.integer(),
  chunksHigh: sq.integer(),
});

export const worldChunksTable = sq.sqliteTable(
  "world_chunks",
  {
    worldId: sq
      .integer("world_id")
      .notNull()
      .references(() => generatedWorldsTable.id, {
        onDelete: "cascade",
      }),

    chunkX: sq.integer("chunk_x").notNull(),
    chunkY: sq.integer("chunk_y").notNull(),

    biome: sq
      .text("biome", {
        enum: ["plains", "mountains", "desert", "volcanic", "ancient_seabed"],
      })
      .notNull(),

    geology: sq
      .text("geology", {
        enum: ["granite", "basalt", "limestone", "shale", "quartzite"],
      })
      .notNull(),

    richness: sq.real("richness").notNull(),

    goldModifier: sq.real("gold_modifier").notNull().default(1),
    silverModifier: sq.real("silver_modifier").notNull().default(1),
    copperModifier: sq.real("copper_modifier").notNull().default(1),
    ironModifier: sq.real("iron_modifier").notNull().default(1),
    coalModifier: sq.real("coal_modifier").notNull().default(1),

    regionName: sq.text("region_name").notNull(),
  },
  (table) => [
    sq.primaryKey({
      columns: [table.worldId, table.chunkX, table.chunkY],
    }),
    sq.index("world_chunks_world_id_idx").on(table.worldId),
  ]
);

export const relations = defineRelations(
  { generatedWorldsTable, worldChunksTable },
  (r) => ({
    generatedWorldsTable: {
      chunks: r.many.worldChunksTable({
        from: r.generatedWorldsTable.id,
        to: r.worldChunksTable.worldId,
      }),
    },

    worldChunksTable: {
      world: r.one.generatedWorldsTable({
        from: r.worldChunksTable.worldId,
        to: r.generatedWorldsTable.id,
        optional: false,
      }),
    },
  })
);
