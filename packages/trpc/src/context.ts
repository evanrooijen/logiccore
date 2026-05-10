import { getDb } from "@logiccore/db";

export function createTRPCRouterContext() {
  return { db: getDb() };
}
