import Logo from "@/components/logo";
import { useLocale } from "next-intl";
import { SupportedLangs } from "@/i18n/types";
import { Link } from "@/i18n/routing";
import { Product } from "@/db/schema";

type SimilarProductCardProps = {
  product: Product;
};

export default function SimilarProductCard({
  product,
}: SimilarProductCardProps) {
  const locale = useLocale() as SupportedLangs;
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-row gap-5 items-center">
          <div className="w-10 h-10">
            <Logo name={product.name} url={product.thumb_url || ""} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold hover:underline">{product.name}</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground line-clamp-4 hover:line-clamp-none transition-all duration-300 ease-in-out">
                {product.translations?.[locale]?.tagline || product.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}