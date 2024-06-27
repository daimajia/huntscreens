import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import assert from "assert";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = {
  id: number
}

export async function GET(request: Request, context: { params: Params }) {
  const product = await db.query.producthunt.findFirst({
    where: eq(producthunt.id, context.params.id)
  })
  return NextResponse.json(product);
}