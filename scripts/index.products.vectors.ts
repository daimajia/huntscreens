import { db } from "@/db/db";
import { desc, sql } from "drizzle-orm";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { saveEmbeddingByProduct } from "@/lib/ai/embeding2";
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT = 5;
const PAGE_SIZE = 500;

async function saveAllProductEmbeddings() {
  console.log("Starting to save all product embeddings...");

  // Get total count of products
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(visibleProducts);
  console.log(`Total products to process: ${count}`);

  const totalPages = Math.ceil(Number(count) / PAGE_SIZE);
  const limit = pLimit(CONCURRENCY_LIMIT);

  for (let page = 0; page < totalPages; page++) {
    const offset = page * PAGE_SIZE;
    const products = await db.select()
      .from(visibleProducts)
      .orderBy(desc(visibleProducts.added_at))
      .limit(PAGE_SIZE)
      .offset(offset);

    console.log(`Processing page ${page + 1} of ${totalPages} (${products.length} products)`);

    const tasks = products.map(product => limit(async () => {
      try {
        console.log(`Processing product: ${product.name} (UUID: ${product.uuid})`);
        await saveEmbeddingByProduct(product, false);
        console.log(`Successfully saved embedding for product: ${product.name} (UUID: ${product.uuid})`);
      } catch (error) {
        console.error(`Error saving embedding for product: ${product.name} (UUID: ${product.uuid})`, error);
      }
    }));

    await Promise.all(tasks);
    console.log(`Finished processing page ${page + 1}`);
  }

  console.log("Finished saving all product embeddings.");
}

if (require.main === module) {
  saveAllProductEmbeddings().catch(console.error);
}
