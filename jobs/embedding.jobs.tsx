import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { producthunt, yc, indiehackers, embeddings, taaft } from "@/db/schema";
import { generateEmbedding } from "@/lib/ai/embeding";
import { eq } from "drizzle-orm";
const embeddingConcurrencyLimit = client.defineConcurrencyLimit({
  id: `embedding-limit`,
  limit: 10,
});

client.defineJob({
  id: "create-embedding-by-type",
  name: "Create Embedding by Product Type",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "create.embedding.by.type",
    schema: z.object({
      productType: z.enum(["ph", "yc", "indiehackers", "taaft"]),
      uuid: z.string(),
    })
  }),
  concurrencyLimit: embeddingConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { productType, uuid } = payload;
    
    let product;
    switch (productType) {
      case "ph":
        product = await db.select().from(producthunt).where(eq(producthunt.uuid, uuid)).limit(1);
        break;
      case "yc":
        product = await db.select().from(yc).where(eq(yc.uuid, uuid)).limit(1);
        break;
      case "indiehackers":
        product = await db.select().from(indiehackers).where(eq(indiehackers.uuid, uuid)).limit(1);
        break;
      case "taaft":
        product = await db.select().from(taaft).where(eq(taaft.uuid, uuid)).limit(1);
        break;
    }

    if (!product || product.length === 0) {
      await io.logger.error(`Product not found for ${productType} with UUID ${uuid}`);
      return { success: false, error: "Product not found" };
    }

    const item = product[0];

    if(!item.webp) {
      await io.logger.error(`Product has no image for ${productType} with UUID ${uuid}`);
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
        name: item.name!,
        itemType: productType,
        website: item.website!,
        description: description!,
        embedding: embedding,
        thumb_url: item.thumb_url,
        tagline: item.tagline,
        itemId: item.id,
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
