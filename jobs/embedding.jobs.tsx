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
  id: "index-all-embeddings",
  name: "Index All Embeddings",
  version: "0.0.3",
  trigger: eventTrigger({
    name: "index.all.embeddings"
  }),
  run: async (payload, io, ctx) => {
    const phProducts = await db.select().from(producthunt).where(eq(producthunt.webp, true));
    const ycProducts = await db.select().from(yc).where(eq(yc.webp, true));
    const ihProducts = await db.select().from(indiehackers).where(eq(indiehackers.webp, true));

    for (const product of [...phProducts, ...ycProducts, ...ihProducts]) {
      await io.sendEvent(`create-embedding-${product.uuid}`, {
        name: "create.embedding",
        payload: {
          itemPid: product.id,
          itemUUID: product.uuid,
          itemType: product.itemType,
          name: product.name,
          website: product.website,
          description: product.description,
          tagline: product.tagline,
          thumb_url: product.thumb_url,
        }
      });
    }
  }
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

client.defineJob({
  id: "create-embedding",
  name: "Create Embedding",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "create.embedding",
    schema: z.object({
      itemUUID: z.string(),
      itemType: z.string(),
      name: z.string(),
      website: z.string(),
      description: z.string(),
      thumb_url: z.string(),
      tagline: z.string(),
      itemPid: z.number(),
    })
  }),
  concurrencyLimit: embeddingConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { itemUUID, itemType, name, website, description, thumb_url, tagline, itemPid } = payload;

    try {

      const existingEmbedding = await db.select().from(embeddings).where(eq(embeddings.itemUUID, itemUUID)).limit(1);

      if (existingEmbedding.length > 0) {
        await io.logger.info(`Embedding already exists for ${itemType} item ${itemUUID}. Skipping.`);
        return { success: true, itemUUID, itemType, skipped: true };
      }
      
      const embedding = await generateEmbedding(description);

      await db.insert(embeddings).values({
        itemType,
        name,
        website,
        description,
        embedding,
        thumb_url: thumb_url,
        tagline: tagline,
        itemId: itemPid,
        itemUUID: itemUUID,
      });

      await io.logger.info(`Successfully created embedding for ${itemType} item ${itemUUID}`);
      return { success: true, itemUUID, itemType };
    } catch (error) {
      await io.logger.error(`Error creating embedding for ${itemType} item ${itemUUID}: ${error}`);
    }
  }
});
