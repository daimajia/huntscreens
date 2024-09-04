import { findSimilarProducts } from "@/lib/ai/embeding";
import SimilarProductCard from "./card/similar.product.card";
import { ProductTypes } from "@/types/product.types";
import { getTranslations } from "next-intl/server";

type SimilarProductProps = {
  name: string;
  description: string;
  uuid: string;
}

export default async function SimilarProducts({uuid, name, description }: SimilarProductProps) {
  const similarProducts = await findSimilarProducts(uuid, description);
  const t = await getTranslations("Showcase");
  return (
    <div className="grid gap-4">
      {similarProducts.length > 0 && (
        <h2 className="text-2xl font-bold">
          {t("Alternatives", {
            name: name
          })}
        </h2>
      )}
      {similarProducts.map((product) => (
        <SimilarProductCard
          tagline={product.tagline || ""}
          key={product.itemId}
          itemId={product.itemId.toString()}
          itemType={product.itemType as ProductTypes}
          name={product.name}
          website={product.website}
          description={product.description}
          thumb_url={product.thumb_url || ""}
        />
      ))}
    </div>
  );
}
