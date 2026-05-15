import { schema, table, t } from "spacetimedb/server";

const world = table(
  { public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    name: t.string(),
  }
);

const spacetimedb = schema({
  world,
});

export default spacetimedb;

export const add = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    ctx.db.world.insert({ name, id: 0n });
  }
);

export const deleteWorld = spacetimedb.reducer(
  { worldId: t.u64() },
  (ctx, { worldId }) => {
    ctx.db.world.id.delete(worldId);
  }
);
