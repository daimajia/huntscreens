import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import assert from "assert";
import { eq, desc, and, arrayContains } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies, headers } from 'next/headers';

type Params = {
  topic: string,
  sort: 'time' | 'vote',
  page: number
}

export async function GET(request: Request, context: { params: Params }) {
  
  assert(context.params.page >= 0);
  const query = context.params.topic === "All" 
                ? eq(producthunt.webp, true) : 
                and(
                  eq(producthunt.webp, true),
                  arrayContains(producthunt.tags, [context.params.topic])
                )
  const data = await db.query.producthunt.findMany({
    where: query,
    orderBy: [context.params.sort === "time" ? desc(producthunt.added_at) : desc(producthunt.votesCount)],
    limit: 30,
    offset: (context.params.page - 1) * 30
  })
  cookies().set('sort', context.params.sort);
  cookies().set('topic', context.params.topic);
  return NextResponse.json(data);
}