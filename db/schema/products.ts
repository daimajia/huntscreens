import { SupportedLangs } from "@/i18n/types";
import { Category } from "@/lib/ai/types";
import { sql } from "drizzle-orm";
import { timestamp, text, boolean, uuid, jsonb, integer, index } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { TranslationContent, SEOContent, ProductMetadata } from "./types";

export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export const products = pgTable("products", {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  id: integer("id"),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  tagline: text('tagline'),
  description: text('description'),
  website: text('website').notNull(),
  itemType: text('itemType').notNull(),
  thumb_url: text('thumb_url'),
  added_at: timestamp('added_at').defaultNow(),
  launched_at: timestamp('launched_at').notNull(),
  webp: boolean('webp').default(false),
  aiintro: text('aiintro'),
  metadata: jsonb('metadata').$type<ProductMetadata>().default(sql`'{}'::jsonb`),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>().default(sql`'{}'::jsonb`),
  seo: jsonb('seo').$type<Partial<Record<SupportedLangs, SEOContent>>>().default(sql`'{}'::jsonb`),
  categories: jsonb('categories').$type<Category>().default(sql`'{}'::jsonb`),
  isai: boolean('isai').default(false)
}, (table) => ({
  uuidIndex: index('product_uuid_index').on(table.uuid),
  addedAtIndex: index('product_added_at_index').on(table.added_at),
  itemTypeIndex: index('product_item_type_index').on(table.itemType),
  webpIndex: index('product_webp_index').on(table.webp),
  categoriesTopicIndex: index('product_categories_gin_index').using('gin', sql`categories->'topics'->'slug' jsonb_path_ops`),
}));