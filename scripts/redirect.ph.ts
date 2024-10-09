import { db } from "@/db/db";
import { products } from "@/db/schema";
import { unifyUrl } from "@/lib/utils/url";
import { desc, eq } from "drizzle-orm";

async function redirectURLs() {
  console.log("Starting to redirect for all products...");

  const allProducts = await db.select({
    uuid: products.uuid,
    website: products.website
  }).from(products).where(eq(products.itemType, 'ph')).orderBy(desc(products.added_at));

  console.log(`Total products to process: ${allProducts.length}`);
  let counter = 0;
  for(const product of allProducts){
    counter++;
    // console.log(`Processed ${counter} of ${allProducts.length} products`);
    if(!product.website.includes('https://www.producthunt.com/r/')){
      continue;
    }
    try {
      const resp = await fetch(product.website);
      const url = unifyUrl(resp.url);
      await db.update(products)
        .set({ website: url })
        .where(eq(products.uuid, product.uuid));
      console.log(`Redirected URL for product: ${product.website} (UUID: ${product.uuid}) to ${url}`);
    } catch (error) {
      console.error(`Error redirecting URL for product: ${product.website} (UUID: ${product.uuid})`, error);
    }
  }
  console.log("Finished redirecting URLs for all products.");
}

if (require.main === module) {
  redirectURLs().catch(console.error);
}