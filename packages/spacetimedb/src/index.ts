import { generateWorld } from "@logiccore/world";
import type { ChunkData } from "@logiccore/world";
import { schema, table, t } from "spacetimedb/server";

const biome = t.enum("Biome", [
  "plains",
  "mountains",
  "desert",
  "volcanic",
  "ancient_seabed",
]);

const rockType = t.enum("RockType", [
  "granite",
  "basalt",
  "limestone",
  "shale",
  "quartzite",
]);

const oreModifiers = t.object("OreModifiers", {
  gold: t.number(),
  silver: t.number(),
  copper: t.number(),
  iron: t.number(),
  coal: t.number(),
});

const world = table(
  { public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    seed: t.number(),
    size: t.number(),
    chunkSize: t.number(),
    chunksWide: t.number(),
    chunksHigh: t.number(),
  }
);

const chunk = table(
  {
    name: "chunk",
    public: true,
    indexes: [
      {
        accessor: "by_world",
        algorithm: "btree",
        columns: ["worldId"],
      },
      {
        accessor: "by_world_and_coords",
        algorithm: "btree",
        columns: ["worldId", "chunkX", "chunkY"],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    worldId: t.u64(),
    chunkX: t.number(),
    chunkY: t.number(),
    biome,
    geology: rockType,
    richness: t.number(),
    oreModifiers,
    regionName: t.string(),
  }
);

const spacetimedb = schema({
  world,
  chunk,
});

export default spacetimedb;

const toChunkRow = (worldId: bigint, chunkData: ChunkData) => ({
  id: 0n,
  worldId,
  chunkX: chunkData.chunkX,
  chunkY: chunkData.chunkY,
  biome: { tag: chunkData.biome },
  geology: { tag: chunkData.geology },
  richness: chunkData.richness,
  oreModifiers: chunkData.oreModifiers,
  regionName: chunkData.regionName,
});

export const add = spacetimedb.reducer(
  { seed: t.number() },
  (ctx, { seed }) => {
    const { chunks, ...rest } = generateWorld(seed, 2048, 32);
    const worldRow = ctx.db.world.insert({ ...rest, id: 0n });

    for (const chunkData of chunks) {
      ctx.db.chunk.insert(toChunkRow(worldRow.id, chunkData));
    }
  }
);

export const deleteWorld = spacetimedb.reducer(
  { worldId: t.u64() },
  (ctx, { worldId }) => {
    ctx.db.chunk.by_world.delete(worldId);
    ctx.db.world.id.delete(worldId);
  }
);
