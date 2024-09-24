import { Product } from "@/db/schema";
import { findSimilarProductsByProduct } from "@/lib/ai/embeding2";
import SimilarProductCard from "./card/similar.product.card";
import { getTranslations } from "next-intl/server";

type SimilarProductProps = {
  product: Product;
}

export default async function SimilarProducts({ product }: SimilarProductProps) {
  const results = await findSimilarProductsByProduct(product);
  const t = await getTranslations("Showcase");
  return (
    <div className="grid gap-4">
      {results.length > 0 && (
        <h2 className="text-2xl font-bold">
          {t("Alternatives", {
            name: product.name
          })}
        </h2>
      )}

      {results.map((product) => {
        return <>
          <SimilarProductCard
            product={product}
          />
        </>
      }
      )}
    </div>
  );
}