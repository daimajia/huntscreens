import { db } from "@/db/db";
import { ProductHuntMetadata } from "@/db/schema/types";
import { visibleProducts } from "@/db/schema/views/visible.products";
import { sql, desc } from "drizzle-orm";

export async function queryLatestPHTop10() {
  const phs = await db.select().from(visibleProducts)
                .where(
                  sql`${visibleProducts.itemType} = 'ph' AND ${visibleProducts.added_at} >= NOW() - INTERVAL '1 days'`
                )
                .orderBy(desc(sql`(${visibleProducts.metadata}->>'votesCount')::INTEGER`))
                .limit(10);
  return phs;
}

if (require.main === module) {
  queryLatestPHTop10().then((phs) => {
    console.log(phs.map((ph) => (ph.metadata as ProductHuntMetadata)?.votesCount));
  });
}
