import query_favorites from "@/lib/api/favorites";
import { NextResponse } from "next/server";

type Params = {
  page: number,
}

export async function GET(request: Request, context: { params: Params }) {
  const data = await query_favorites({page: context.params.page});
  return NextResponse.json(data);
}