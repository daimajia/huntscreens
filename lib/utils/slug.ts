import { db } from "@/db/db";
import { products } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import slugify from "slugify";
import { customAlphabet } from "nanoid";

export async function checkSlugExists(slug: string, excludeUUID?: string){
  const query = excludeUUID? and(
    ne(products.uuid, excludeUUID),
    eq(products.slug, slug)
  ) : eq(products.slug, slug);
  
  const existing = await db.select().from(products).where(query).limit(1);
  return existing.length > 0;
}

export async function getAvailableSlug(name: string): Promise<string | null> {
  if(!name || name.length === 0) return null;
  const nanoid = customAlphabet('1234567890abcdef', 10)
  let end = false;
  let tmpSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  while(!end){
    const existing = await db.select({uuid: products.uuid}).from(products).where(
      eq(products.slug, tmpSlug)
    ).limit(1);

    if(existing.length === 0){
      end = true;
    }else{
      tmpSlug = slugify(name + '-' + nanoid(3), {
        lower: true,
        strict: true,
        trim: true,
      });
    }
  }

  return tmpSlug;
}