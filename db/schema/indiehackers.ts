import { SupportedLangs } from "@/i18n/types";
import { eq, SQL, sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, pgView, QueryBuilder, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { SEOContent, TranslationContent } from "./types";
import { Category } from "@/lib/ai/types";

export type IndieHackers = typeof indiehackers.$inferSelect;
export type NewIndieHackers = typeof indiehackers.$inferInsert;

export const indiehackers = pgTable('indiehackers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  tags: text('tags').array(),
  thumb_url: text('thumb_url'),
  thumbnail: text('thumbnail'),
  website: text("website").notNull(),
  itemType: text('itemType').default("indiehackers"),
  tagline: text('tagline'),
  description: text('description'),
  objectId: text('objectId'),
  revenue: integer('revenue'),
  followers: integer('followers'),
  twitterHandle: text("twitterHandle"),
  userIds: text('userIds').array(),
  startDate: text('startDate'),
  region: text('region').default(""),
  added_at: timestamp('added_at'),
  uuid: uuid('uuid').defaultRandom(),
  webp: boolean('webp').default(false),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>().default(sql`'{}'::jsonb`),
  seo: jsonb('seo').$type<Partial<Record<SupportedLangs, SEOContent>>>().default(sql`'{}'::jsonb`),
  categories: jsonb('categories').$type<Category>().default(sql`'{}'::jsonb`),
  isai: boolean('isai').default(false)
}, (table) => {
  return {
    ihuuidIndex: index('ih_uuid_index').on(table.uuid)
  }
});

export const indiehackersViewQuery = (qb: QueryBuilder, window: SQL, where=eq(indiehackers.webp, true)) => {
  return qb.select({
    id: indiehackers.id,
    added_ad: indiehackers.added_at,
    revenue: indiehackers.revenue,
    name: indiehackers.name,
    prev: sql<number>`LAG(${indiehackers.id}) OVER ${window}`.as('prev'),
    next: sql<number>`LEAD(${indiehackers.id}) OVER ${window}`.as('next'),
    row_no: sql<number>`ROW_NUMBER() OVER ${window}`.as('row_no')
  }).from(indiehackers).where(where);
}

export const sorted_indiehackers_by_addedat = pgView("sorted_indiehackers_by_addedat").as((qb) => {
  const window = sql`(ORDER BY ${indiehackers.added_at} DESC)`;
  return indiehackersViewQuery(qb, window);
})

export const sorted_indiehackers_by_revenue = pgView("sorted_indiehackers_by_revenue").as((qb) => {
  const window = sql`(ORDER BY ${indiehackers.revenue} DESC)`;
  return indiehackersViewQuery(qb, window);
})