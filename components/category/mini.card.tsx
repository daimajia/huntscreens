/* eslint-disable @next/next/no-img-element */
import { Link } from "@/i18n/routing";
import { SupportedLangs } from "@/i18n/types";
import MiniScreenshotLoader, { MiniLogoLoader } from "../ui-custom/mini.image.loader";
import { Product } from "@/db/schema";

const MiniCard = ({ product, locale, isMainContent = true }: { product: Product, locale?: SupportedLangs, isMainContent?: boolean }) => {
  const tagline = product.seo?.[locale ?? 'en']?.tagline || product.translations?.[locale ?? 'en']?.tagline || product.tagline;
  
  const TitleTag = isMainContent ? 'h2' : 'h3';
  const SubtitleTag = isMainContent ? 'h3' : 'p';

  return (
    <Link href={`/products/${product.slug}`} className="block" target="_blank" prefetch={false}>
      <div className="flex flex-col bg-white border border-gray-200 hover:border-gray-500/40 dark:hover:border-white/50 dark:border-gray-700 h-full dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          <MiniScreenshotLoader
            key={product.uuid}
            src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/cdn-cgi/image/width=800,height=500,fit=cover,gravity=0x0,format=webp/${product.uuid}.webp`}
            alt={product.name}
            className="w-full object-cover object-center h-48"
            errorClassName="bg-gray-100 dark:bg-gray-800 h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
          <div className="flex border absolute bottom-3 left-3 w-10 h-10 rounded-full border-1 bg-white border-gray-200 shadow-md">
            <MiniLogoLoader
              src={product.thumb_url || ""}
              alt={`${product.name} logo`}
              size={40}
              className="rounded-full w-full h-full"
            />
          </div>
        </div>
        <div className="p-4 flex flex-col h-full">
          <TitleTag className="font-bold text-base dark:text-gray-100 truncate">{product.name}</TitleTag>
          <SubtitleTag className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 mb-3">{tagline}</SubtitleTag>
          <div className="mt-auto flex justify-end">
            {product.categories?.topics?.[0] && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {product.categories.topics[0].translations[locale ?? "en"]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MiniCard;