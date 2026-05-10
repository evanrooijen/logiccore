import { createTRPCRouterContext } from "@logiccore/trpc/context";
import { appRouter } from "@logiccore/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    createContext: () => createTRPCRouterContext(),
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });

export { handler as GET, handler as POST };
