import { db } from "@/db/db"
import { yc } from "@/db/schema"
import { YCSortBy, YCStatus } from "@/types/yc.types"
import assert from "assert"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type Params = {
  vc: "yc",
  status: YCStatus,
  sort: YCSortBy,
  page: number
}

export async function GET(request: Request, context: {params: Params}) {
  assert(context.params.page > 0);
  let order;
  if(context.params.sort === "time") {
    order = [desc(yc.launched_at), desc(yc.id)];
  }else{
    order = [desc(yc.team_size), desc(yc.id)];
  }
  const where = [eq(yc.webp, true), isNotNull(yc.team_size)];
  if(context.params.status === "Acquired" || context.params.status === "Public"){
    where.push(eq(yc.status, context.params.status));
  }

  const data = await db.query.yc.findMany({
    where: and(...where),
    orderBy: order,
    limit: 30,
    offset: (context.params.page - 1) * 30
  });
  cookies().set("vc", context.params.vc);
  cookies().set('yc.sort', context.params.sort);
  cookies().set('yc.status', context.params.status);
  return NextResponse.json(data);
}