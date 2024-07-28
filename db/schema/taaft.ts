import { sql } from "drizzle-orm";
import { boolean, date, index, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type Taaft = typeof taaft.$inferSelect;

export const taaft = pgTable('taaft', {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  tagline: text('tagline'),
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
}, (table) => {
  return {
    taaftuuidIndex: index('taaft_uuid_index').on(table.uuid),
    taaftCreatedAtIndex: index('taaft_created_at_index').on(table.created_at)
  }
});