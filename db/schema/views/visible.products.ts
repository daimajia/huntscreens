import { sql } from 'drizzle-orm';
import { pgView } from 'drizzle-orm/pg-core';
import { products } from '../products';

export const visibleProducts = pgView('visible_products').as((qb) => {
  return qb
    .select()
    .from(products)
    .where(sql`${products.webp} = true`)
    .orderBy(sql`${products.launched_at} DESC`);
});
