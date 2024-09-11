import { SupportedLangs } from "@/i18n/types";
import { sql } from "drizzle-orm";
import { boolean, date, index, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { SEOContent, TranslationContent } from "./types";
import { Category } from "@/lib/ai/types";

export type Taaft = typeof taaft.$inferSelect;
export type NewTaaft = typeof taaft.$inferInsert;

export const taaft = pgTable('taaft', {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  tagline: text('tagline'),
  itemType: text('itemType').default("taaft"),
  website: text('website').notNull(),
  description: text('description'),
  added_at: date("added_at"),
  thumb_url: text('thumb_url'),
  main_category: text('main_category'),
  savesCount: integer("savesCount").default(0),
  commentsCount: integer('commentsCount').default(0),
  screenshot: text('screenshot'),
  pros: text('pros').array().default(sql`ARRAY[]::text[]`),
  cons: text('cons').array().default(sql`ARRAY[]::text[]`),
  tags: text('tags').array().default(sql`ARRAY[]::text[]`),
  faqs: jsonb('faq').$type<{question: string | null, answer: string | null}[]>(),
  related: jsonb('related').$type<{
    icon: string | null,
    name: string | null,
    website: string | null,
    taaft_url: string | null
  }[]>(),
  uuid: uuid('uuid').defaultRandom().notNull(),
  webp: boolean('webp').default(false),
  created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>().default(sql`'{}'::jsonb`),
  seo: jsonb('seo').$type<Partial<Record<SupportedLangs, SEOContent>>>().default(sql`'{}'::jsonb`),
  categories: jsonb('categories').$type<Category>().default(sql`'{}'::jsonb`),
  isai: boolean('isai').default(false)
}, (table) => {
  return {
    taaftuuidIndex: index('taaft_uuid_index').on(table.uuid),
    taaftCreatedAtIndex: index('taaft_created_at_index').on(table.created_at)
  }
});