import { generatedWorldsTable } from "@logiccore/db/schema";
import { generateWorld } from "@logiccore/world";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, baseProcedure } from "../../public";

export const router = createTRPCRouter({
  generate: baseProcedure
    .input(
      z.object({
        seed: z.number().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const world = generateWorld(input.seed, 2048, 32);

      const { chunkSize, chunksHigh, chunksWide } = world;

      const [row] = await ctx.db
        .insert(generatedWorldsTable)
        .values({
          chunksHigh,
          chunkSize,
          chunksWide,
          seed: input.seed,
          size: 2048,
        })
        .returning({ id: generatedWorldsTable.id });

      if (!row) {
        throw new Error("Failed to persist generated world");
      }

      return {
        success: true,
        worldId: row.id,
      } as const;
    }),
  list: baseProcedure.query(async ({ ctx }) => {
    const worlds = await ctx.db.query.generatedWorldsTable.findMany();

    return {
      success: true,
      data: worlds,
    } as const;
  }),
  deleteWorld: baseProcedure
    .input(
      z.object({
        worldId: z.number().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.dir(input);

      await ctx.db
        .delete(generatedWorldsTable)
        .where(eq(generatedWorldsTable.id, input.worldId));

      return {
        success: true,
      } as const;
    }),
});
