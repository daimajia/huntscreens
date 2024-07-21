import query_indiehacker from "@/lib/api/query.indiehacker";
import { IHSort } from "@/types/indiehackers.types";
import { NextResponse } from "next/server";

type Params = {
  id: number,
  sort: IHSort
}

export async function GET(request: Request, context: { params: Params }) {
  const data = await query_indiehacker(context.params.id, context.params.sort);
  return NextResponse.json(data);
}