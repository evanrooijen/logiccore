import { createTRPCRouter } from "../public";
import { router as world } from "./world";

export const appRouter = createTRPCRouter({
  world,
});

// export type definition of API
export type AppRouter = typeof appRouter;
