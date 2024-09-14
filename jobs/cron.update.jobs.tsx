import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";
import { getBulkCategoryProducts } from "@/lib/api/query.landing";
import Categorydata from "@/i18n/custom/categories.json";

client.defineJob({
  id: "update-homepage-content",
  name: "Update Homepage Content",
  version: "0.0.1",
  trigger: intervalTrigger({
    seconds: 600 // 10 minutes
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info('Starting homepage content update');

    const maincategory_slugs = Categorydata.map(c => c.slug);

    try {
      const updatedDatapack = await getBulkCategoryProducts(maincategory_slugs, true);
      await io.logger.info('Homepage content updated successfully', { 
        categoriesUpdated: maincategory_slugs.length,
        totalProducts: updatedDatapack.reduce((sum, pack) => sum + pack.products.length, 0)
      });

      return {
        success: true,
        categoriesUpdated: maincategory_slugs.length
      };
    } catch (error) {
      await io.logger.error('Error updating homepage content', { error });
      return { success: false, error: String(error) };
    }
  }
});
