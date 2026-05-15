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
  add: baseProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await spacetimeDbQuery(
        ctx.db,
        (conn) => conn.reducers.add({ name: input.name }),
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
