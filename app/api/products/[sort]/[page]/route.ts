import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import assert from "assert";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

type Params = {
  sort: 'time' | 'vote',
  page: number
}

export async function GET(request: Request, context: { params: Params }) {
  assert(context.params.page >= 0);
  const data = await db.query.producthunt.findMany({
    where: eq(producthunt.s3, true),
    orderBy: [context.params.sort === "time" ? desc(producthunt.id) : desc(producthunt.votesCount)],
    limit: 30,
    offset: (context.params.page - 1) * 30
  })
  cookies().set('sort', context.params.sort);
  return NextResponse.json(data);
}