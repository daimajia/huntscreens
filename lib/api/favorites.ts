import { db } from "@/db/db";
import { getCurrentUser } from "../user";
import { favorites } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ProductTypes } from "@/app/types/product.types";
import assert from "assert";

export async function add_favorite(itemId: string, itemType: ProductTypes) {
  const user = await getCurrentUser();
  if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const exist = await db.query.favorites.findFirst({
    where: and(eq(favorites.itemId, itemId), eq(favorites.userId, user.uuid))
  })
  if(!exist) {
    const result = await db.insert(favorites).values({
      userId: user.uuid,
      itemId: itemId,
      itemType: itemType
    }).returning();
    return NextResponse.json({message: "Added Successfully!", addedId: result[0].itemId});
  }else {
    return NextResponse.json({message: "Already added"});
  }
}

export async function delete_favorite(itemId: string){
  const user = await getCurrentUser();
  if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await db.delete(favorites).where(and(
    eq(favorites.userId, user.uuid),
    eq(favorites.itemId, itemId)
  )).returning({ deletedId: favorites.itemId });
  if (result.length === 0) {
    return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully", deletedId: result[0].deletedId });
}

type QueryFavoriteProps = {
  page: number
}

export default async function query_favorites({page} : QueryFavoriteProps) {
  assert(page >= 0);
  const user = await getCurrentUser();
  if(!user) return [];
  const favs = await db.query.favorites.findMany({
    where: eq(favorites.userId, user.uuid || ""),
    with: {
      ph: true,
      yc: true,
      taaft: true,
      indiehackers: true,
    },
    orderBy: desc(favorites.createdAt),
    limit: 20,
    offset: (page - 1) * 20
  })
  return favs;
}