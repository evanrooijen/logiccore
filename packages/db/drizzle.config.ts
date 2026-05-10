import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    // oxlint-disable-next-line typescript/no-non-null-assertion
    url: process.env.DB_FILE_NAME!,
  },
});
