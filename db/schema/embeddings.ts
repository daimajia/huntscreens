import { relations } from "drizzle-orm";
import { index, integer, pgTable, serial, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { producthunt } from "./ph";
import { yc } from "./yc";
import { indiehackers } from "./indiehackers";
import { taaft } from "./taaft";

export const embeddings = pgTable('embeddings', {
  id: serial('id').primaryKey(),
  itemUUID: uuid('item_uuid').notNull(),
  itemId: integer('item_id').notNull(),
  itemType: text('item_type').notNull(),
  tagline: text('tagline'),
  thumb_url: text('thumb_url'),
  website: text('website').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  embedding: vector('embedding', { dimensions: 384 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
}));

export type Products = typeof embeddings.$inferSelect;
export type NewProducts = typeof embeddings.$inferInsert;

export const productsRelations = relations(embeddings, ({ one }) => ({
  ph: one(producthunt, {
    fields: [embeddings.itemUUID],
    references: [producthunt.uuid],
    relationName: 'productHuntEmbedding',
  }),
  yc: one(yc, {
    fields: [embeddings.itemUUID],
    references: [yc.uuid],
    relationName: 'ycEmbedding',
  }),
  indiehackers: one(indiehackers, {
    fields: [embeddings.itemUUID],
    references: [indiehackers.uuid],
    relationName: 'indiehackersEmbedding',
  }),
  taaft: one(taaft, {
    fields: [embeddings.itemUUID],
    references: [taaft.uuid],
    relationName: 'taaftEmbedding',
  }),
}));