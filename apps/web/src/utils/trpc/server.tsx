import "server-only";
import { createCallerFactory } from "@logiccore/trpc";
import { createTRPCRouterContext } from "@logiccore/trpc/context";
import { makeQueryClient } from "@logiccore/trpc/query-client";
import { appRouter } from "@logiccore/trpc/routers";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);

/** One caller per RSC request — avoids sharing a single SpacetimeDB builder across requests. */
export const getCaller = cache(() => createCaller(createTRPCRouterContext()));

export const trpc = createTRPCOptionsProxy({
  ctx: () => createTRPCRouterContext(),
  router: appRouter,
  queryClient: getQueryClient,
});
