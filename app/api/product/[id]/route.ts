import queryProduct from "@/lib/api/query.product";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Params = {
  id: number
}

export async function GET(request: Request, context: { params: Params }) {
  const sort = cookies().get('sort')?.value || 'time';
  const data = await queryProduct(context.params.id, sort === "time" ? "time" : "vote")
  return NextResponse.json(data);
}