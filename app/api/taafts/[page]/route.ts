import { db } from "@/db/db"
import { taaft } from "@/db/schema"
import assert from "assert"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

type Params = {
  page: number
}

export async function GET(request: Request, context: { params: Params }){
  assert(context.params.page > 0);
  const data = await db.query.taaft.findMany({
    where: eq(taaft.webp, true),
    limit: 30,
    orderBy: desc(taaft.added_at),
    offset: (context.params.page - 1) * 30
  })
  return NextResponse.json(data);
}