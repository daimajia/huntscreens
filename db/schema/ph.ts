import { integer, json, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

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
  description: text("description"),
  slug: text('slug'),
  votesCount: integer("votesCount"),
  website: text('website'),
  productLinks: json('productLinks').$type<ProductLink[]>(),
  thumbnail: json('thumbnail').$type<Thumbnail>(),
  cursor: text('cursor'),
  topics: json('topics').$type<Topic>(),
  createdAt: timestamp("createdAt", { mode: "string" }),
  featuredAt: timestamp("featuredAt", { mode: "string" }),
  screenshot: text("screenshot"),
  uuid: uuid('uuid').defaultRandom()
});

export type Producthunt = typeof producthunt.$inferSelect;