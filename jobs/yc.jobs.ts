import { intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { fethcYCLatestCompanies } from "@/lib/yc";
import { products } from "@/db/schema";
import { unifyUrl } from "@/lib/utils/url";
import { getAvailableSlug } from "@/lib/utils/slug";

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
      if(!company.id || !company.name || !company.website || company.name.length === 0) {
        await io.logger.info(`company has no id, name or website, skipping ${new Date().toISOString()}`);
        continue;
      }

      company.website = unifyUrl(company.website);

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
        ...company,
        slug: await getAvailableSlug(company.name) || ""
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
