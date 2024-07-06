import { sql } from 'drizzle-orm';
import { boolean, index, integer, json, pgTable, pgView, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
  tags: text('tags').array().default(sql`'{}'::text[]`),
  createdAt: timestamp("createdAt", { mode: "string" }),
  featuredAt: timestamp("featuredAt", { mode: "string" }),
  uuid: uuid('uuid').defaultRandom(),
  s3: boolean('s3').default(false),
  webp: boolean('webp').default(false),
  added_at: timestamp('added_at').defaultNow(),
  commentCount: integer("comment_count").default(0)
}, (table) => {
  return {
    addedAtIndex: index('added_at_index').on(table.added_at),
    voteCountIndex: index('vote_count_index').on(table.votesCount),
    featureAtIndex: index('featured_at_index').on(table.featuredAt)
  }
});

export const sortedProducthunts = pgView("sortedphs", {
  id: serial('id').primaryKey(),
  row_no: integer("row_no").notNull()
}).as(sql`
    select
    row_number() over (
      order by
        added_at desc
    ) as row_no,
      *
    from
      producthunt
    where
      webp = true;
  `);

export type Producthunt = typeof producthunt.$inferSelect;