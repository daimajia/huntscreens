import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { generateEmbedding } from "@/lib/ai/embeding";
import { eq } from "drizzle-orm";
import { embeddings } from "@/db/schema";
import { ProductTypes } from "@/types/product.types";
import { visibleProducts } from "@/db/schema/views/visible.products";

const embeddingConcurrencyLimit = client.defineConcurrencyLimit({
  id: `embedding-limit`,
  limit: 5,
});

client.defineJob({
  id: "create-embedding-by-type",
  name: "Create Embedding by Product Type",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "create.embedding.by.type",
    schema: z.object({
      uuid: z.string(),
    })
  }),
  concurrencyLimit: embeddingConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { uuid } = payload;
    
    let product;
    product = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, uuid)).limit(1);

    if (!product || product.length === 0) {
      await io.logger.error(`Product not found for ${uuid}`);
      return { success: false, error: "Product not found" };
    }

    const item = product[0];
    const productType = item.itemType;

    if(!item.webp) {
      await io.logger.error(`Product has no image for ${uuid} ${item.name} ${item.website}`);
      return { success: false, error: "Product has no image" };
    }

    try {
      const existingEmbedding = await db.select().from(embeddings).where(eq(embeddings.itemUUID, uuid)).limit(1);

      if (existingEmbedding.length > 0) {
        await io.logger.info(`Embedding already exists for ${productType} item ${uuid}. Skipping.`);
        return { success: true, itemUUID: uuid, itemType: productType, skipped: true };
      }
      
      const description = item.description || item.tagline || item.name;
      const embedding = await generateEmbedding(description!);

      await db.insert(embeddings).values({
        name: item.name,
        itemType: productType as ProductTypes,
        website: item.website,
        description: description || "",
        embedding: embedding,
        thumb_url: item.thumb_url || "",
        tagline: item.tagline || "",
        itemId: item.id || 0,
        itemUUID: uuid,
      });

      await io.logger.info(`Successfully created embedding for ${productType} item ${uuid}`);
      return { success: true, itemUUID: uuid, itemType: productType };
    } catch (error) {
      await io.logger.error(`Error creating embedding for ${productType} item ${uuid}: ${error}`);
      return { success: false, error: String(error) };
    }
  }
});
