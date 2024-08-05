import { boolean, index, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const intro = pgTable("intros", {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').notNull(),
  website: text('website').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  version: text('version').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  deleted: boolean("deleted").default(false)
}, (table) => {
  return {
    introuuidIndex: index('intro_uuid').on(table.uuid)
  }
});

export type Intro = typeof intro.$inferSelect;
export type IntroInsert = typeof intro.$inferInsert;