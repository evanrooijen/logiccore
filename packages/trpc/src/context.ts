// oxlint-disable typescript/no-non-null-assertion
import { DbConnection } from "@logiccore/spacetimedb";

export function createTRPCRouterContext() {
  const connection = DbConnection.builder()
    .withUri(process.env.SPACETIMEDB_HOST!)
    .withDatabaseName(process.env.SPACETIMEDB_DB_NAME!);
  return { db: connection };
}
