import { queryTopicsItemCount } from "@/lib/api/query.topics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topics } = await request.json();

    const results = await queryTopicsItemCount(topics);

    if(results.error){
      return NextResponse.json({ error: results.error }, { status: 400 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
