import { tables } from "@logiccore/spacetimedb";
import { z } from "zod";

import { createTRPCRouter, baseProcedure } from "../../public";
import { spacetimeDbQuery } from "../../utils";

export const router = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    const data = await spacetimeDbQuery(
      ctx.db,
      (conn) => [...conn.db.world.iter()],
      tables.world
    );

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
    .query(async ({ ctx, input }) => {
      const data = await spacetimeDbQuery(
        ctx.db,
        (conn) => conn.db.world.id.find(input.worldId) ?? null,
        tables.world
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
    .query(async ({ ctx, input }) => {
      const data = await spacetimeDbQuery(
        ctx.db,
        (conn) => conn.db.chunk.by_world.filter(input.worldId),
        tables.chunk
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
    .mutation(async ({ ctx, input }) => {
      await spacetimeDbQuery(
        ctx.db,
        (conn) => conn.reducers.add({ seed: input.seed }),
        tables.world
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
    .mutation(async ({ ctx, input }) => {
      await spacetimeDbQuery(
        ctx.db,
        (conn) => conn.reducers.deleteWorld({ worldId: input.worldId }),
        tables.world
      );
      return {
        success: true,
      } as const;
    }),
});
