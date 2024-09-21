import { SupportedLangs } from "@/i18n/types";
import { sql, eq, SQL, and, gte } from "drizzle-orm";
import { boolean, date, index, integer, jsonb, pgTable, pgView, QueryBuilder, serial, text, uuid } from "drizzle-orm/pg-core";
import { SEOContent, TranslationContent } from "./types";
import { Category } from "@/lib/ai/types";

export type YC  = typeof yc.$inferSelect;
export type NewYC = typeof yc.$inferInsert;

export const yc = pgTable('yc', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug'),
  tagline: text('tagline'),
  itemType: text('itemType').default("yc"),
  thumb_url: text('thumb_url'),
  website: text('website').notNull(),
  batch: text('batch'),
  all_locations: text('all_locations'),
  description: text('description'),
  team_size: integer('team_size').default(0),
  industry: text('industry'),
  subindustry: text('subindustry'),
  launched_at: date('launched_at'),
  tags: text('tags').array(),
  top_company: boolean('top_company'),
  is_hiring: boolean('is_hiring'),
  nonprofit: boolean('nonprofit'),
  status: text('status'),
  industries: text('industries').array(),
  regions: text('regions').array(),
  stage: text('stage'),
  objectID: text('objectID'),
  uuid: uuid('uuid').defaultRandom().notNull(),
  webp: boolean('webp').default(false),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>().default(sql`'{}'::jsonb`),
  seo: jsonb('seo').$type<Partial<Record<SupportedLangs, SEOContent>>>().default(sql`'{}'::jsonb`),
  categories: jsonb('categories').$type<Category>().default(sql`'{}'::jsonb`),
  isai: boolean('isai').default(false)
}, (table) => {
  return {
    ycuuidIndex: index('yc_uuid_idx').on(table.uuid),
    yc_launchedat_index: index('yc_launched_at_idx').on(table.launched_at),
    yc_status_index: index('yc_status_idx').on(table.status),
    yc_team_size: index('yc_teamsiz_idx').on(table.team_size)
  }
})

export const  ycViewQuery = (qb: QueryBuilder, window: SQL, where=eq(yc.webp, true)) => {
  return qb.select({
    id: yc.id,
    team_size: yc.team_size,
    launched_at: yc.launched_at,
    status: yc.status,
    stage: yc.stage,
    prev: sql<number>`LAG(${yc.id}) OVER ${window}`.as('prev'),
    next: sql<number>`LEAD(${yc.id}) OVER ${window}`.as('next'),
    row_no: sql<number>`ROW_NUMBER() OVER ${window}`.as('row_no')
  }).from(yc).where(where);
}

export const sorted_yc_by_launchedat =  pgView('sorted_yc_by_launchedat').as((qb) => {
  const window = sql`(ORDER BY ${yc.launched_at} DESC, ${yc.id} DESC)`;
  return ycViewQuery(qb, window);
}); 

export const sorted_yc_by_teamsize =  pgView('sorted_yc_by_teamsize').as((qb) => {
  const window = sql`(ORDER BY ${yc.team_size} DESC, ${yc.id} DESC)`;
  return ycViewQuery(qb, window, and(eq(yc.webp, true), gte(yc.team_size, 0)));
}); 