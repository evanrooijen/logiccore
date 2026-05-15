// oxlint-disable promise/avoid-new
// oxlint-disable promise/prefer-await-to-callbacks

import type { DbConnection, DbConnectionBuilder } from "@logiccore/spacetimedb";
import type { RowTypedQuery } from "spacetimedb";

type QueryCallback<T> = (conn: DbConnection) => T | Promise<T>;

export const spacetimeDbQuery = <T, Row, ST>(
  db: DbConnectionBuilder,
  callback: QueryCallback<T>,
  subscribe: RowTypedQuery<Row, ST>
): Promise<T> =>
  new Promise((resolve, reject) => {
    try {
      db.onConnect((conn) => {
        conn
          .subscriptionBuilder()
          .onApplied(async () => {
            try {
              const data = await callback(conn);
              resolve(data);
            } catch (error) {
              reject(error);
            } finally {
              conn.disconnect();
            }
          })
          .subscribe(subscribe);
      }).build();
    } catch (error) {
      reject(error);
    }
  });
