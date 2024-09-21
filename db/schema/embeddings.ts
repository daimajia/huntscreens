import { relations } from "drizzle-orm";
import { index, integer, pgTable, serial, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { products } from "./products";
import { TranslationContent } from "./types";
import { SupportedLangs } from "@/i18n/types";

export const embeddings = pgTable('embeddings', {
  id: serial('id').primaryKey(),
  itemUUID: uuid('item_uuid').notNull(),
  itemId: integer('item_id').notNull(),
  itemType: text('item_type').notNull(),
  tagline: text('tagline'),
  thumb_url: text('thumb_url'),
  website: text('website').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  embedding: vector('embedding', { dimensions: 384 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
}));

export type Embedding = typeof embeddings.$inferSelect;
export type EmbeddingWithSimilarity = Embedding & { 
  similarity: number, 
  launch_date: string,
  translations: Partial<Record<SupportedLangs, TranslationContent>> };

export type NewEmbedding = typeof embeddings.$inferInsert;

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  product: one(products, {
    fields: [embeddings.itemUUID],
    references: [products.uuid],
    relationName: 'productEmbedding',
  }),
}));