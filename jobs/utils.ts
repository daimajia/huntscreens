import { ProductTypes } from "@/types/product.types";
import { IO } from "@trigger.dev/sdk";

export default async function triggerCommonJobs(io: IO, uuid:string, productType:ProductTypes) {
  await io.sendEvent(`create embedding for ${uuid} ${productType}`, {
    name: "create.embedding.by.type",
    payload: {
      productType: productType,
      uuid: uuid,
    }
  });
  await io.sendEvent(`create category for ${uuid} ${productType}`, {
    name: "generate.category.for.product",
    payload: {
      productType: productType,
      uuid: uuid,
    }
  });
}