import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/db/db";
import { embeddings } from "@/db/schema";
import { generateEmbedding } from "@/lib/ai/embeding";

const embeddingConcurrencyLimit = client.defineConcurrencyLimit({
  id: `embedding-limit`,
  limit: 3,
});

client.defineJob({
  id: "create-embedding",
  name: "Create Embedding",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "create.embedding",
    schema: z.object({
      itemId: z.string(),
      itemType: z.string(),
      name: z.string(),
      website: z.string(),
      description: z.string(),
    })
  }),
  concurrencyLimit: embeddingConcurrencyLimit,
  run: async (payload, io, ctx) => {
    const { itemId, itemType, name, website, description } = payload;

    try {
      const embedding = await generateEmbedding(description);

      await db.insert(embeddings).values({
        itemId,
        itemType,
        name,
        website,
        description,
        embedding,
      });

      await io.logger.info(`Successfully created embedding for ${itemType} item ${itemId}`);
      return { success: true, itemId, itemType };
    } catch (error) {
      await io.logger.error(`Error creating embedding for ${itemType} item ${itemId}: ${error}`);
    }
  }
});
