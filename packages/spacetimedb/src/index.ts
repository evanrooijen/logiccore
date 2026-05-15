import { generateWorld } from "@logiccore/world";
import { schema, table, t } from "spacetimedb/server";

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

const spacetimedb = schema({
  world,
});

export default spacetimedb;

export const add = spacetimedb.reducer(
  { seed: t.number() },
  (ctx, { seed }) => {
    const { chunks: _, ...rest } = generateWorld(seed, 2048, 32);
    ctx.db.world.insert({ ...rest, id: 0n });
  }
);

export const deleteWorld = spacetimedb.reducer(
  { worldId: t.u64() },
  (ctx, { worldId }) => {
    ctx.db.world.id.delete(worldId);
  }
);
