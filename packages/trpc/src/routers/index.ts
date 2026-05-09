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
    .mutation(({ input }) => {
      /* empty */
      const world = generateWorld(input.seed, 2048, 32);
      return {
        status: "success",
        data: world,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
