import { db } from "@/db/db";
import { favorites } from "@/db/schema";
import { getCurrentUser } from "@/lib/user";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if(!user) return NextResponse.json([]);

  const { itemIds } = await request.json();
  if (!Array.isArray(itemIds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const favs = await db
  .select({ itemId: favorites.itemId })
  .from(favorites)
  .where(
    and(
      eq(favorites.userId, user.uuid),
      inArray(favorites.itemId, itemIds)
    )
  );
  const data = favs.flatMap((item) => item.itemId);
  return NextResponse.json(data);
}