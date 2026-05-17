// oxlint-disable promise/avoid-new
// oxlint-disable typescript/no-non-null-assertion
import { DbConnection } from "@logiccore/spacetimedb";
import type { DbConnectionBuilder } from "@logiccore/spacetimedb";
import type { RowTypedQuery } from "spacetimedb";

type QueryCallback<T> = (conn: DbConnection) => T | Promise<T>;

// oxlint-disable-next-line typescript/no-explicit-any
type SubscribeInput = string | RowTypedQuery<any, any>;

const createConnectionBuilder = (): DbConnectionBuilder =>
  DbConnection.builder()
    .withUri(process.env.SPACETIMEDB_HOST!)
    .withDatabaseName(process.env.SPACETIMEDB_DB_NAME!);

const runQuery = async <T>(
  conn: DbConnection,
  query: QueryCallback<T>,
  resolve: (value: T) => void,
  reject: (reason?: unknown) => void
) => {
  try {
    const data = await query(conn);
    resolve(data);
  } catch (error) {
    reject(error);
  } finally {
    conn.disconnect();
  }
};

const connect = <T>(
  configure: (db: DbConnectionBuilder) => DbConnectionBuilder,
  onConnected: (
    conn: DbConnection,
    resolve: (value: T) => void,
    reject: (reason?: unknown) => void
  ) => void
): Promise<T> =>
  new Promise((resolve, reject) => {
    const db = configure(createConnectionBuilder());

    db.onConnect((conn) => {
      onConnected(conn, resolve, reject);
    })
      .onConnectError((_ctx, error) => {
        reject(error);
      })
      .build();
  });

/** Read from the local cache after the subscription is applied. */
export const spacetimeDbQuery = <T>(
  subscribe: SubscribeInput,
  query: QueryCallback<T>
): Promise<T> =>
  connect(
    (db) => db,
    (conn, resolve, reject) => {
      conn
        .subscriptionBuilder()
        .onApplied(() => {
          void runQuery(conn, query, resolve, reject);
        })
        .onError(() => {
          reject(new Error("SpacetimeDB subscription failed"));
          conn.disconnect();
        })
        .subscribe(subscribe);
    }
  );

/** Invoke a reducer without subscribing to table data. */
export const spacetimeDbMutation = <T>(
  mutation: QueryCallback<T>
): Promise<T> =>
  connect(
    (db) => db,
    (conn, resolve, reject) => {
      void runQuery(conn, mutation, resolve, reject);
    }
  );
