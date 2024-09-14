import redis from "@/db/redis";
import { getCategoryProducts } from "./query.category";
import { IndexDataPack } from "./query.types";


export const getBulkCategoryProducts = async (maincategory_slugs: string[], forceUpdate: boolean = false): Promise<IndexDataPack[]> => {
  let products: IndexDataPack[] = [];
  if(!forceUpdate) {
    try {
      let data = await redis.get('index:datapack');
      if (data) {
        return JSON.parse(data) as IndexDataPack[];
      }
    } catch (e) {
      console.error(e);
    }
  }

  products = await Promise.all(maincategory_slugs.map(slug => {
    if (slug === 'just-launched') {
      return getCategoryProducts(slug, 1, 8);
    }
    return getCategoryProducts(slug, 1, 4);
  }));
  await redis.setex('index:datapack', 60 * 30, JSON.stringify(products));
  return products;
}