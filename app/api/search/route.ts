import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { sql } from "drizzle-orm";
import { producthunt, yc, indiehackers, taaft } from "@/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 30;
  const offset = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const searchResults = await db.execute(sql`
    SELECT id, name, tagline, description, website, thumb_url, uuid, "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${producthunt}
    WHERE name % ${query} OR tagline % ${query} OR description % ${query}
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${yc}
    WHERE name % ${query} OR tagline % ${query} OR description % ${query}
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${indiehackers}
    WHERE name % ${query} OR tagline % ${query} OR description % ${query}
    UNION ALL
    SELECT id, name, tagline, description, website, thumb_url, uuid, "itemType",
           similarity(name, ${query}) AS similarity
    FROM ${taaft}
    WHERE name % ${query} OR tagline % ${query} OR description % ${query}
    ORDER BY similarity DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return NextResponse.json(searchResults);
}