import { db } from "@/db/db"
import { yc } from "@/db/schema"
import assert from "assert"
import { and, desc, eq, isNotNull, ne } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type Params = {
  vc: "yc",
  sort: "time" | "teamsize",
  page: number
}
export async function GET(request: Request, context: {params: Params}) {
  assert(context.params.page > 0);
  let order;
  if(context.params.sort === "time") {
    order = desc(yc.launched_at);
  }else{
    order = desc(yc.team_size);
  }
  const data = await db.query.yc.findMany({
    where: and(eq(yc.webp, true), isNotNull(yc.team_size)),
    orderBy: order,
    limit: 30,
    offset: (context.params.page - 1) * 30
  });
  cookies().set("vc", context.params.vc);
  cookies().set('yc.sort', context.params.sort);
  return NextResponse.json(data);
}