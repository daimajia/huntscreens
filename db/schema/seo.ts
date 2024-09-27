import { locales } from "@/i18n/types";
import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const SeoType = pgEnum("seo_type", ["category", "topic"]);
export const SEOLanguage = pgEnum("seo_language", locales);

export const seo = pgTable("seo", {
  id: serial('id').primaryKey(),
  type: SeoType('type').notNull(),
  slug: text('slug').notNull(),
  language: SEOLanguage('language').notNull(),
  title: text('title').notNull(),
  keywords: jsonb('keywords').$type<string[]>().default(sql`'[]'::jsonb`),
  description: text('description'),
  version: integer('version').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  deleted: boolean("deleted").default(false)
}, (table) => {
  return {
    seoSlugIndex: index('seo_slug_index').on(table.slug),
    seoLanguageIndex: index('seo_language_index').on(table.language),
    seoTypeIndex: index('seo_type_index').on(table.type),
    seoVersionIndex: index('seo_version_index').on(table.version),
  }
});

export type Seo = typeof seo.$inferSelect;
export type SeoInsert = typeof seo.$inferInsert;