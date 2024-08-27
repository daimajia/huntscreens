import { db } from "@/db/db";
import { producthunt, yc, indiehackers, embeddings, taaft } from "@/db/schema";
import { generateEmbedding } from "@/lib/ai/embeding";
import { eq } from "drizzle-orm";

async function generateEmbeddingsForTable(table: any, itemType: string) {
  const items = await db.select().from(table).where(eq(table.webp, true));
  
  for (const item of items) {
    console.log(`Generating embedding for ${itemType} item ${item.website}`);
    const existingEmbedding = await db.select().from(embeddings).where(eq(embeddings.itemUUID, item.uuid)).limit(1);

    if (existingEmbedding.length > 0) {
      console.log(`Embedding already exists for ${itemType} item ${item.uuid}. Skipping.`);
      continue;
    }

    const description = item.description || item.tagline || item.name;
    const embeddingVector = await generateEmbedding(description);

    await db.insert(embeddings).values({
      itemUUID: item.uuid,
      itemId: item.id,
      itemType: itemType,
      tagline: item.tagline,
      thumb_url: item.thumb_url,
      website: item.website,
      name: item.name,
      description: description,
      embedding: embeddingVector,
    });

    console.log(`Generated embedding for ${itemType} item ${item.uuid}`);
  }
}

async function generateAllEmbeddings() {
  console.log("Generating embeddings for ProductHunt items...");
  await generateEmbeddingsForTable(producthunt, "ph");

  console.log("Generating embeddings for YC items...");
  await generateEmbeddingsForTable(yc, "yc");

  console.log("Generating embeddings for IndieHackers items...");
  await generateEmbeddingsForTable(indiehackers, "indiehackers");

  console.log("Generating embeddings for TAAFT items...");
  await generateEmbeddingsForTable(taaft, "taaft");

  console.log("All embeddings generated successfully!");
}
if (require.main === module) {
  generateAllEmbeddings().catch(console.error);
}
