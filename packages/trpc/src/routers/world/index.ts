import { tables } from "@logiccore/spacetimedb";
import { z } from "zod";

import { createTRPCRouter, baseProcedure } from "../../public";
import { spacetimeDbMutation, spacetimeDbQuery } from "../../utils";

export const router = createTRPCRouter({
  list: baseProcedure.query(async () => {
    const data = await spacetimeDbQuery(tables.world, (conn) => [
      ...conn.db.world.iter(),
    ]);

    return {
      success: true,
      data,
    } as const;
  }),
  get: baseProcedure
    .input(
      z.object({
        worldId: z.coerce.bigint().positive(),
      })
    )
    .query(async ({ input }) => {
      const data = await spacetimeDbQuery(
        tables.world.where((row) => row.id.eq(input.worldId)),
        (conn) => conn.db.world.id.find(input.worldId) ?? null
      );

      return {
        success: true,
        data,
      } as const;
    }),
  chunks: baseProcedure
    .input(
      z.object({
        worldId: z.coerce.bigint().positive(),
      })
    )
    .query(async ({ input }) => {
      const data = await spacetimeDbQuery(
        tables.chunk.where((row) => row.worldId.eq(input.worldId)),
        (conn) => conn.db.chunk.by_world.filter(input.worldId)
      );

      return {
        success: true,
        data,
      } as const;
    }),
  add: baseProcedure
    .input(
      z.object({
        seed: z.number().nonnegative(),
      })
    )
    .mutation(async ({ input }) => {
      await spacetimeDbMutation((conn) =>
        conn.reducers.add({ seed: input.seed })
      );
      return {
        success: true,
      } as const;
    }),
  delete: baseProcedure
    .input(
      z.object({
        worldId: z.bigint().positive(),
      })
    )
    .mutation(async ({ input }) => {
      await spacetimeDbMutation((conn) =>
        conn.reducers.deleteWorld({ worldId: input.worldId })
      );
      return {
        success: true,
      } as const;
    }),
});
