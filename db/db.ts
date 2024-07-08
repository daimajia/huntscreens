import 'dotenv/config';
import * as schema from "./schema"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, {schema: schema});