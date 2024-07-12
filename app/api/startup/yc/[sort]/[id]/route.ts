import { StartupSortBy } from "@/app/(cats)/startup/yc/components/startup.list"
import query_yc from "@/lib/api/query.yc"
import { NextResponse } from "next/server";

type Params = {
  id: number,
  sort: StartupSortBy,
}
export async function GET(request: Request, context: {params: Params}) {
  const data = await query_yc(context.params.id, context.params.sort);
  return NextResponse.json(data);
}