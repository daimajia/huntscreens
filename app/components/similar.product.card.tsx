import Logo from "@/components/logo";
import { ProductTypes, urlMapper } from "../types/product.types";
import { ExternalLink } from "lucide-react"; // 导入外部链接图标

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
    <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex flex-row gap-5 items-center">
        <Logo name={name} url={thumb_url} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <a href={urlMapper[itemType](itemId)} className="text-lg font-bold hover:underline">
              {name}
            </a>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Visit Website"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all duration-300 ease-in-out">
        {tagline}
      </p>
    </div>
  );
}