import redis from "@/db/redis";
import { getCategoryProducts } from "./query.category";
import { IndexDataPack } from "./query.types";

export const getBulkCategoryProducts = async (maincategory_slugs: string[], forceUpdate: boolean = false): Promise<IndexDataPack[]> => {
  if (!forceUpdate) {
    try {
      let data = await redis.get('index:v2:datapack');
      if (data) {
        return JSON.parse(data) as IndexDataPack[];
      }
    } catch (e) {
      console.error(e);
    }
  }

  const products: IndexDataPack[] = [];
  
  for (const slug of maincategory_slugs) {
    const result = await getCategoryProducts(slug, 1, slug === 'just-launched' ? 8 : 4);
    products.push(result);
  }

  await redis.setex('index:v2:datapack', 60 * 60 * 24, JSON.stringify(products));
  return products;
}