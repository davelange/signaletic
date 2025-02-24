import { remultSveltekit } from "remult/remult-sveltekit";
import { createPostgresDataProvider } from "remult/postgres";
import { entities } from "./entities";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dataProvider = createPostgresDataProvider({
  connectionString: process.env["DATABASE_URL"],
});

export const api = remultSveltekit({
  dataProvider,
  entities,
});
