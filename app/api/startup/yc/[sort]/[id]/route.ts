import { YCSortBy } from "@/types/yc.types";
import query_yc from "@/lib/api/query.yc";
import { NextResponse } from "next/server";

type Params = {
  id: number,
  sort: YCSortBy,
}
export async function GET(request: Request, context: {params: Params}) {
  const data = await query_yc(context.params.id, context.params.sort);
  return NextResponse.json(data);
}