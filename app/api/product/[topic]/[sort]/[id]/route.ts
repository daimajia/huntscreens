import { SortBy } from "@/app/types/api.types";
import queryProduct from "@/lib/api/query.product";
import { NextResponse } from "next/server";

type Params = {
  id: number,
  sort: SortBy,
  topic: string
}

export async function GET(request: Request, context: { params: Params }) {
  const data = await queryProduct(context.params.id, context.params.sort, context.params.topic);
  return NextResponse.json(data);
}