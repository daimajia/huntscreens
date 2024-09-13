import { SupportedLangs } from '@/i18n/types';
import { SortBy } from '@/types/api.types';
import { and, arrayContains, eq, SQL, sql } from 'drizzle-orm';
import { boolean, index, integer, json, jsonb, pgTable, pgView, QueryBuilder, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { SEOContent, TranslationContent } from './types';
import { Category } from "@/lib/ai/types";

type Thumbnail = {
  type: string,
  url: string
}

type ProductLink = {
  type: string,
  url: string
}

type Topic = {
  nodes : [
    {
      name: string
    }
  ]
}

export const producthunt = pgTable('producthunt', {
  id: serial('id').primaryKey(),
  url: text("url"),
  name: text('name'),
  tagline: text('tagline'),
  itemType: text('itemType').default("ph"),
  description: text("description"),
  slug: text('slug'),
  votesCount: integer("votesCount"),
  website: text('website'),
  productLinks: json('productLinks').$type<ProductLink[]>(),
  thumb_url: text('thumb_url'),
  thumbnail: json('thumbnail').$type<Thumbnail>(),
  cursor: text('cursor'),
  topics: json('topics').$type<Topic>(),
  tags: text('tags').array().default(sql`'{}'::text[]`),
  createdAt: timestamp("createdAt", { mode: "string" }),
  featuredAt: timestamp("featuredAt", { mode: "string" }),
  uuid: uuid('uuid').defaultRandom(),
  s3: boolean('s3').default(false),
  webp: boolean('webp').default(false),
  added_at: timestamp('added_at').defaultNow(),
  commentCount: integer("comment_count").default(0),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>().default(sql`'{}'::jsonb`),
  seo: jsonb('seo').$type<Partial<Record<SupportedLangs, SEOContent>>>().default(sql`'{}'::jsonb`),
  categories: jsonb('categories').$type<Category>().default(sql`'{}'::jsonb`),
  isai: boolean('isai').default(false)
}, (table) => {
  return {
    addedAtIndex: index('added_at_index').on(table.added_at),
    voteCountIndex: index('vote_count_index').on(table.votesCount),
    featureAtIndex: index('featured_at_index').on(table.featuredAt),
    phuuidIndex: index('ph_uuid_index').on(table.uuid),
    addedAtVotesCountIndex: index('added_at_votes_count_index').on(table.added_at, table.votesCount),
    webpIndex: index('webp_index').on(table.webp),
    tagsIndex: index('tags_index').on(table.tags)
  }
});

export type Producthunt = typeof producthunt.$inferSelect;
export type ProducthuntInsert = typeof producthunt.$inferInsert;

export const phViewQueryByTopic = (qb: QueryBuilder, sort: SortBy, topic: string) => {
  let window;
  
  switch(sort) {
    case "time":
      window = sql`(ORDER BY DATE(${producthunt.added_at}) DESC, ${producthunt.votesCount} DESC)`;
      break;
    case "vote":
      window = sql`(ORDER BY ${producthunt.votesCount} DESC)`;
      break;
  }

  return phViewQuery(qb, window, and(eq(producthunt.webp, true), arrayContains(producthunt.tags, [topic])))
}

const phViewQuery = (qb: QueryBuilder, window: SQL, where=eq(producthunt.webp, true)) => {
  return qb
    .select({
      id: producthunt.id,
      tags: producthunt.tags,
      added_at: producthunt.added_at,
      votesCount: producthunt.votesCount,
      prev: sql<number>`LAG(${producthunt.id}) OVER ${window}`.as('prev'),
      next: sql<number>`LEAD(${producthunt.id}) OVER ${window}`.as('next'),
      row_no: sql<number>`ROW_NUMBER() OVER ${window}`.as('row_no'),
    })
    .from(producthunt)
    .where(where);
}

export const sortedphbytime = pgView('sortedphbytime').as((qb) => {
  const window = sql`(ORDER BY DATE(${producthunt.added_at}) DESC, ${producthunt.votesCount} DESC)`;
  return phViewQuery(qb, window);
});

export const sortedphbyvote = pgView('sortedphbyvote').as((qb) => {
  const window = sql`(ORDER BY ${producthunt.votesCount} DESC)`;
  return phViewQuery(qb, window);
});