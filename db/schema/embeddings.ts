import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { producthunt } from "./ph";
import { yc } from "./yc";
import { indiehackers } from "./indiehackers";
import { taaft } from "./taaft";

export const embeddings = pgTable('embeddings', {
  id: serial('id').primaryKey(),
  itemId: uuid('item_id').notNull(),
  itemType: text('item_type').notNull(),
  website: text('website').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  embedding: vector('embedding', { dimensions: 384 }),
  createdAt: timestamp('created_at').defaultNow()
});

export type Products = typeof embeddings.$inferSelect;
export type NewProducts = typeof embeddings.$inferInsert;

export const productsRelations = relations(embeddings, ({ one }) => ({
  ph: one(producthunt, {
    fields: [embeddings.itemId],
    references: [producthunt.uuid],
    relationName: 'productHuntEmbedding',
  }),
  yc: one(yc, {
    fields: [embeddings.itemId],
    references: [yc.uuid],
    relationName: 'ycEmbedding',
  }),
  indiehackers: one(indiehackers, {
    fields: [embeddings.itemId],
    references: [indiehackers.uuid],
    relationName: 'indiehackersEmbedding',
  }),
  taaft: one(taaft, {
    fields: [embeddings.itemId],
    references: [taaft.uuid],
    relationName: 'taaftEmbedding',
  }),
}));