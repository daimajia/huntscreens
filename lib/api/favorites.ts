"use server";

import { db } from "@/db/db";
import { getCurrentUser } from "../user";
import { favorites } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { ProductTypes } from "@/types/product.types";
import assert from "assert";
import { signIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth/logto";

export async function remove_favorite_action(itemId: string, itemType: ProductTypes) {
  const user = await getCurrentUser();
  if(!user) {
    'use server';
    return await signIn(logtoConfig);
  }
  const result = await db.delete(favorites).where(and(
    eq(favorites.userId, user.uuid),
    eq(favorites.itemId, itemId)
  )).returning();
  if (result.length === 0) {
    return { error: true, message: "😭 Favorite not found" };
  }
  return { error: false, message: "👌 Deleted successfully"};
}

export async function add_favorite_action(itemId: string, itemType: ProductTypes) {
  const user = await getCurrentUser();
  if(!user) {
    'use server';
    return await signIn(logtoConfig);
  }
  try{
  const exist = await db.query.favorites.findFirst({
    where: and(eq(favorites.itemId, itemId), eq(favorites.userId, user.uuid))
  })
  if(exist) return { error: true, message: "Already added" };
  await db.insert(favorites).values({
    userId: user.uuid,
    itemId: itemId,
    itemType: itemType
  }).returning();
    return {error: false, message: "👍 Added Successfully!"};
  } catch (error) {
    console.log(error);
    return { error: true, message: "😭 Failed to add" };
  }
}

type QueryFavoriteProps = {
  page: number,
  pageSize: number
}

export async function is_favorite(itemId: string) {
  const user = await getCurrentUser();
  if(!user) return false;
  const exist = await db.query.favorites.findFirst({
    where: and(eq(favorites.itemId, itemId), eq(favorites.userId, user.uuid))
  })
  return exist ? true : false;
}

export default async function query_favorites({page, pageSize} : QueryFavoriteProps) {
  assert(page >= 0);
  const user = await getCurrentUser();
  if(!user) return { favorites: [], totalCount: 0, totalPages: 0, pageSize: pageSize };
  
  const [favs, totalCountResult] = await Promise.all([
    db.query.favorites.findMany({
      where: eq(favorites.userId, user.uuid || ""),
      with: {
        product: true
      },
      orderBy: desc(favorites.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize
    }),
    db.select({ count: sql`count(*)` }).from(favorites).where(eq(favorites.userId, user.uuid || ""))
  ]);

  const totalCount = Number(totalCountResult[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  return { favorites: favs, totalCount, totalPages, pageSize };
}