import { YCSortBy, YCStatus } from "@/types/yc.types";
import query_yc from "@/lib/api/query.yc";
import { NextResponse } from "next/server";

type Params = {
  id: number,
  sort: YCSortBy,
  status: YCStatus
}
export async function GET(request: Request, context: {params: Params}) {
  const data = await query_yc(context.params.id, context.params.sort, context.params.status);
  return NextResponse.json(data);
}