import { generatedWorldsTable } from "@logiccore/db/schema";
import { generateWorld } from "@logiccore/world";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../public";

export const appRouter = createTRPCRouter({
  generate: baseProcedure
    .input(
      z.object({
        seed: z.number().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const world = generateWorld(input.seed, 2048, 32);

      const [row] = await ctx.db
        .insert(generatedWorldsTable)
        .values({ payload: world })
        .returning({ id: generatedWorldsTable.id });

      if (!row) {
        throw new Error("Failed to persist generated world");
      }

      return {
        status: "success",
        worldId: row.id,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
