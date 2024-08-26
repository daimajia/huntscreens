import Logo from "@/components/logo";
import { ProductTypes, urlMapper } from "../types/product.types";
import { ExternalLink } from "lucide-react"; // 导入外部链接图标
import Link from "next/link";

type SimilarProductCardProps = {
  itemId: string;
  itemType: ProductTypes;
  name: string;
  website: string;
  description: string;
  thumb_url: string;
  tagline: string;
};

export default function SimilarProductCard({
  itemId,
  itemType,
  name,
  website,
  description,
  tagline,
  thumb_url,
}: SimilarProductCardProps) {
  return (
    <Link href={urlMapper[itemType](itemId)}>
      <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-row gap-5 items-center">
          <div className="w-10 h-10">
            <Logo name={name} url={thumb_url} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold hover:underline">{name}</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground line-clamp-4 hover:line-clamp-none transition-all duration-300 ease-in-out">
                {tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}