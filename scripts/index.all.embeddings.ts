import { db } from "@/db/db";
import { embeddings, visibleProducts } from "@/db/schema";
import { generateEmbedding } from "@/lib/ai/embeding";
import { ProductTypes } from "@/types/product.types";
import { eq } from "drizzle-orm";

async function generateEmbeddingsForTable() {
  const items = await db.select().from(visibleProducts);
  
  for (const item of items) {
    console.log(`Generating embedding for ${item.itemType} item ${item.website}`);
    const existingEmbedding = await db.select().from(embeddings).where(eq(embeddings.itemUUID, item.uuid)).limit(1);

    if (existingEmbedding.length > 0) {
      console.log(`Embedding already exists for ${item.itemType} item ${item.uuid}. Skipping.`);
      continue;
    }

    const description = item.description || item.tagline || item.name;
    const embeddingVector = await generateEmbedding(description);

    await db.insert(embeddings).values({
      itemUUID: item.uuid,
      itemId: item.id!,
      itemType: item.itemType as ProductTypes,
      tagline: item.tagline,
      thumb_url: item.thumb_url,
      website: item.website,
      name: item.name,
      description: description,
      embedding: embeddingVector,
    });

    console.log(`Generated embedding for ${item.itemType} item ${item.uuid}`);
  }
}

async function generateAllEmbeddings() {
  console.log("Generating embeddings for all items...");
  await generateEmbeddingsForTable();

  console.log("All embeddings generated successfully!");
}
if (require.main === module) {
  generateAllEmbeddings().catch(console.error);
}
