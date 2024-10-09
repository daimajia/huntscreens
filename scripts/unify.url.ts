import { db } from "@/db/db";
import { products } from "@/db/schema";
import { unifyUrl } from "@/lib/utils/url";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = path.join(__dirname, 'url_changes.txt');

async function unifyURLs() {
  console.log("Starting to unify for all products...");

  const allProducts = await db.select({
    name: products.name,
    uuid: products.uuid,
    website: products.website
  }).from(products).offset(2080);

  console.log(`Total products to process: ${allProducts.length}`);
  let counter = 0;
  for(const product of allProducts){
    counter++;
    try {
      const unifiedWebsite = unifyUrl(product.website);
      if(product.website !== unifiedWebsite){
      // Log the change before updating
      const logEntry = `${product.uuid}:${product.website}:${unifiedWebsite}\n`;
      fs.appendFileSync(LOG_FILE, logEntry);

      await db.update(products)
        .set({ website: unifiedWebsite })
          .where(eq(products.uuid, product.uuid));
      }
    } catch (error) {
      console.error(`Error unifying URL for product: ${product.name} (UUID: ${product.uuid})`, error);
    }
    console.log(`Processed ${counter} of ${allProducts.length} products`);
  }
  console.log("Finished unifying URLs for all products.");
}

if (require.main === module) {
  unifyURLs().catch(console.error);
}