import { sql, eq } from "drizzle-orm";
import { boolean, date, integer, pgTable, pgView, serial, text, uuid } from "drizzle-orm/pg-core";

export type YC  = typeof yc.$inferSelect;

export type YCJson = Omit<YC, "id" | "uuid" | "webp">;

export const yc = pgTable('yc', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug'),
  tagline: text('tagline'),
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
  webp: boolean('webp').default(false)
})

export const sortedyc = pgView('sortedyc').as(
  (qb) => qb.select({
    row_no: sql<number>`
      row_number() over (order by launched_at desc)
    `.as('row_no'),
    id: yc.id,
    team_size: yc.team_size
  }).from(yc).where(eq(yc.webp, true))
)
