import { db } from "@/db/db";
import { embeddings, taaft } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function updateTaaftThumbUrls() {
  const allTaaftEntries = await db.select().from(taaft);
  const notFoundProducts: string[] = [];

  for (const entry of allTaaftEntries) {
    let productName = entry.name.toLowerCase()
      .replace(/[!]/g, '')
      .replace(/[\s.]+/g, '-');
    
    const svgUrl = `https://media.theresanaiforthat.com/icons/${productName}.svg?width=100`;
    const pngUrl = `https://media.theresanaiforthat.com/icons/${productName}.png?width=100`;
    const defaultUrl = `https://media.theresanaiforthat.com/assets/favicon-large.svg?width=100`;

    let newThumbUrl = '';

    if (await checkImageExists(svgUrl)) {
      newThumbUrl = svgUrl;
    } else if (await checkImageExists(pngUrl)) {
      newThumbUrl = pngUrl;
    } else {
      console.log(`No image found for ${entry.name}`);
      newThumbUrl = defaultUrl;
      notFoundProducts.push(entry.name);
      continue;
    }
    await db
      .update(taaft)
      .set({ thumb_url: newThumbUrl })
      .where(eq(taaft.id, entry.id));
      console.log(`Updated ${entry.name} with new thumb_url: ${newThumbUrl}`);
  }

  console.log('All taaft entries have been updated.');
  console.log('Products with no images found:');
  console.log(notFoundProducts);
}

async function updateEmbeddingsThumbUrls() {
  const allTaaftEntries = await db.select().from(taaft);
  
  for (const entry of allTaaftEntries) {
    await db
      .update(embeddings)
      .set({ thumb_url: entry.thumb_url })
      .where(
        and(
          eq(embeddings.itemUUID, entry.uuid),
          eq(embeddings.itemType, 'taaft')
        )
      );
    
    console.log(`Updated embedding thumb_url for ${entry.name}`);
  }

  console.log('All embedding entries have been updated.');
}

// Call the function
if (require.main === module) {
  updateEmbeddingsThumbUrls().catch(console.error);
  updateTaaftThumbUrls().catch(console.error);
}