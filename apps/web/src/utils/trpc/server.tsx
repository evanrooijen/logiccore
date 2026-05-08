import "server-only";
import { makeQueryClient } from "@logiccore/trpc/query-client";
import { appRouter } from "@logiccore/trpc/routers";
import {
  createTRPCContext,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { cache } from "react";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: () => createTRPCContext(),
  router: appRouter,
  queryClient: getQueryClient,
});

// If your router is on a separate server, pass a client instead:
// createTRPCOptionsProxy({
//   client: createTRPCClient({ links: [httpLink({ url: '...' })] }),
//   queryClient: getQueryClient,
// });

export const caller = appRouter.createCaller({});
