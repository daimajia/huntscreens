import { db } from "@/db/db";
import { visibleProducts, products } from "@/db/schema";
import { getIntroFromScreenshot } from "@/lib/ai/intro";
import { eq, isNull } from "drizzle-orm";
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT = 10;

async function generateIntrosForProducts() {
  console.log("Starting to generate intros for all visible products...");

  const allProducts = await db.select({
    name: visibleProducts.name,
    uuid: visibleProducts.uuid,
    website: visibleProducts.website
  }).from(visibleProducts).where(eq(products.intros, {}));
  console.log(`Total products to process: ${allProducts.length}`);

  const limit = pLimit(CONCURRENCY_LIMIT);

  const tasks = allProducts.map(product => limit(async () => {
    try {
      console.log(`Processing product: ${product.name} (UUID: ${product.uuid})`);
      
      const imageUri = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product.uuid}.webp`;
      const intros = await getIntroFromScreenshot(imageUri, product.name, product.website);

      await db.update(products)
        .set({ intros })
        .where(eq(products.uuid, product.uuid));

      console.log(`Successfully generated and saved intro for product: ${product.name} (UUID: ${product.uuid})`);
    } catch (error) {
      console.error(`Error generating intro for product: ${product.name} (UUID: ${product.uuid})`, error);
    }
  }));

  await Promise.all(tasks);
  console.log("Finished generating intros for all visible products.");
}

if (require.main === module) {
  generateIntrosForProducts().catch(console.error);
}
