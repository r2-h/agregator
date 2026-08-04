import { drizzle } from "drizzle-orm/node-postgres/driver";
import { env } from "../config/env";
import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });
