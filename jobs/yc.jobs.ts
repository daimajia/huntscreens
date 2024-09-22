import { intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { fethcYCLatestCompanies } from "@/lib/yc";
import { products } from "@/db/schema";
import slugify from "slugify";
import { parseDate } from "@/lib/utils/time";
import { YCMetadata } from "@/db/schema/types";

client.defineJob({
  id: "Schedule YC Latest Portfolio",
  name: "Schedule YC Latest Portfolio",
  version: "0.0.2",
  trigger: intervalTrigger({
    seconds: 600
  }),
  run: async (payload, io, ctx) => {
    const ycCompanies = await fethcYCLatestCompanies();
    for(const company of ycCompanies){
      if(!company.id || !company.name || !company.website) {
        await io.logger.info(`company has no id, name or website, skipping ${new Date().toISOString()}`);
        continue;
      }
      
      const exist = await db.query.products.findFirst({
        where: and(
          eq(products.itemType, 'yc'),
          eq(products.id, company.id)
        )
      });
      if(exist) {
        await io.logger.info(`company already exists ${company.id}`);
        continue;
      }

      const websiteExist = await db.query.products.findFirst({
        where: eq(products.website, company.website)
      });

      if(websiteExist) {
        await io.logger.info(`company website already exists ${company.id}`);
        continue;
      }

      const inserted = await db.insert(products).values({
          id: company.id,
          name: company.name,
          slug: company.slug || slugify(company.name),
          tagline: company.tagline || "",
          description: company.description || "",
          website: company.website,
          itemType: 'yc',
          thumb_url: company.thumb_url,
          launched_at: company.launched_at ? new Date(company.launched_at) : new Date(),
          metadata: {
            batch: company.batch,
            team_size: company.team_size || 0,
            status: company.status,
            launched_at: company.launched_at ? parseDate(company.launched_at) : new Date(),
          } as YCMetadata
        }).returning();

        await io.sendEvent(`take ${company.website} screenshot`, {
          name: "take.product.screenshot",
          payload: {
            url: company.website,
            uuid: inserted[0].uuid
          }
        })

      }
    }
  }
);
