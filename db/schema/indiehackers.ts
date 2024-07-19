import { boolean, date, integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type IndieHackersJson = Omit<IndieHackers, 'webp' | 'id' | 'uuid'>;

export type IndieHackers = typeof indiehackers.$inferSelect;

export const indiehackers = pgTable('indiehackers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  tags: text('tags').array(),
  thumbnail: text('thumbnail'),
  website: text("website").notNull(),
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
});