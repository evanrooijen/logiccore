import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { createTRPCRouterContext } from "./context";

export const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCRouterContext>>>()
  .create({
    transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const { createCallerFactory } = t;
export const baseProcedure = t.procedure;
