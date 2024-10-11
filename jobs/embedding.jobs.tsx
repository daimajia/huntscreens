import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { saveEmbeddingByUUID } from "@/lib/ai/embeding2";

const embeddingConcurrencyLimit = client.defineConcurrencyLimit({
  id: `embedding-limit`,
  // limit to 1 job because needs to wait for other jobs to finish
  limit: 1,
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
    // wait for 120 seconds, wait other jobs to finish
    await io.wait("wait-for-120-seconds", 120);
    const { uuid } = payload;
    
    let product;
    product = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, uuid)).limit(1);

    if (!product || product.length === 0) {
      await io.logger.error(`Product not found for ${uuid}`);
      return { success: false, error: "Product not found" };
    }

    const item = product[0];
    const productType = item.itemType;

    try {
      
      await saveEmbeddingByUUID(uuid);

      await io.logger.info(`Successfully created embedding for ${productType} item ${uuid}`);
      return { success: true, itemUUID: uuid, itemType: productType };
    } catch (error) {
      await io.logger.error(`Error creating embedding for ${productType} item ${uuid}: ${error}`);
      return { success: false, error: String(error) };
    }
  }
});
