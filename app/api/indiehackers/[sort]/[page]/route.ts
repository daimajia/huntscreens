import { db } from "@/db/db"
import { indiehackers } from "@/db/schema"
import { IHSort } from "@/types/indiehackers.types"
import assert from "assert"
import { and, desc, eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type Params = {
  page: number,
  sort: IHSort
}

export async function GET(request: Request, context: {params: Params}) {
  assert(context.params.page > 0);
  let order = context.params.sort === "time" ? desc(indiehackers.added_at) : desc(indiehackers.revenue);
  const where = [eq(indiehackers.webp, true)];
  const data = await db.query.indiehackers.findMany({
    where: and(...where),
    orderBy: order,
    limit: 30,
    offset: (context.params.page - 1) * 30
  });
  cookies().set('ih.sort', context.params.sort);
  return NextResponse.json(data);
}