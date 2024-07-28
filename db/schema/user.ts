import { boolean, index, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type Users = typeof users.$inferSelect;

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: uuid('user_uuid').defaultRandom().notNull(),
  email: text('email').notNull().unique(),
  name: text('name'),
  email_verified: boolean('email_verified').default(false),
  avatar: text('avatar'),
  subscribed: boolean('subscribed').default(false),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => {
  return {
    emailIdx: index('user_email_idx').on(table.email),
  }
});