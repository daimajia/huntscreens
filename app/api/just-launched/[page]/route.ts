import { db } from "@/db/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = {
  page: number;
};

export async function GET(request: Request, context: { params: Params }) {
  const page = context.params.page;
  const limit = 20;
  const offset = (page - 1) * limit;

  const data = await db.execute(sql`
    SELECT * FROM just_launched_products
    ORDER BY launch_date DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return NextResponse.json(data);
}