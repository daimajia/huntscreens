import { client } from "@/trigger";
import { cronTrigger } from "@trigger.dev/sdk";
import { getBulkCategoryProducts } from "@/lib/api/query.landing";
import Categorydata from "@/i18n/custom/categories.json";

client.defineJob({
  id: "update-homepage-cache",
  name: "Update Homepage Cache",
  version: "0.0.2",
  trigger: cronTrigger({
    cron: "*/10 * * * *" // Run every 10 minutes
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Starting homepage cache update");

    const maincategory_slugs = Categorydata.map(c => c.slug);
    
    try {
      const datapack = await getBulkCategoryProducts(maincategory_slugs, true);
      await io.logger.info(`Successfully updated homepage cache for ${datapack.length} categories`);
      
      return {
        success: true,
        categoriesUpdated: datapack.length
      };
    } catch (error) {
      await io.logger.error(`Error updating homepage cache: ${error}`);
      return {
        success: false,
        error: String(error)
      };
    }
  }
});
