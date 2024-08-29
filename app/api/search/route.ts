import { NextResponse } from "next/server";
import { search } from "@/lib/api/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 30;
  const offset = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const searchResults = await search(query);

  return NextResponse.json(searchResults);
}