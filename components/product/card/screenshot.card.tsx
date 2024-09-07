/* eslint-disable @next/next/no-img-element */
'use client';
import { Link } from "@/i18n/routing";
import UpVote from "../upvote";
import { useMediaQuery } from 'usehooks-ts';
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleFavorite } from "@/stores/favorites.provider";
import { useState } from "react";
import Spiner from "../../ui-custom/skeleton/loading.spin";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductTypes, urlMapper } from "@/types/product.types";
import { useLocale } from 'next-intl';
import { SupportedLangs } from "@/i18n/routing";
import { TranslationContent } from "@/db/schema/types";

export type BaseMiniCardMetadata = {
  id: number,
  name: string,
  uuid: string,
  thumbnail: string | null,
  tagline: string | null,
  website: string,
  new: boolean,
  translations: Record<SupportedLangs, TranslationContent>
}

type ProductHuntMetadata = {
  votesCount: number,
  producthunt_url: string
}

export type MiniCardMetadata<T extends ProductTypes> = T extends 'ph' ? BaseMiniCardMetadata & ProductHuntMetadata : BaseMiniCardMetadata;

interface MiniCardProps<T extends ProductTypes> {
  isFavorite: boolean,
  cardType: T,
  product: MiniCardMetadata<T>,
  showExtra?: boolean
}

export default function MiniScreenshotCard<T extends ProductTypes>({ isFavorite, cardType, product, showExtra }: MiniCardProps<T>) {
  const matches = useMediaQuery("(min-width: 768px)", { defaultValue: true });
  const [favLoading, setFavLoading] = useState(false);
  const router = useRouter();
  const toggleFavorite = useToggleFavorite();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as SupportedLangs;

  const getOptimizedImage = (uuid: string) => {
    return `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/cdn-cgi/image/width=990,height=500,fit=crop,gravity=0x0,format=webp/${uuid}.webp`
  }
  const toggleFavoriteAction = async (itemId: string, itemType: ProductTypes) => {
    setFavLoading(true);
    const resp = await fetch(`/api/user/check-auth?time=${new Date().getTime()}`);
    const result = await resp.json();
    if (result['isLogin']) {
      await toggleFavorite(itemId, itemType);
      setFavLoading(false);
    } else {
      router.push(`/api/user/trigger-signin?redirect=${pathname}${searchParams}`);
    }

  }
  const getLocalizedTagline = () => {
    if (product.translations && product.translations[locale]) {
      return product.translations[locale].tagline || product.tagline;
    }
    return product.tagline;
  };

  return <>
    <div className={`flex flex-col gap-5 hover:bg-muted p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <Link target="_blank" passHref key={product.id} href={urlMapper[cardType](product.id)}>
          <img alt="" loading="lazy" className=" h-[250px] object-cover object-top w-full rounded-t-lg border-gray-400/20 border" src={getOptimizedImage(product.uuid)}></img>
        </Link>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img alt={""} loading="lazy" className="h-10 rounded-full border border-gray-300 dark:border-gray-800/80" src={product.thumbnail || ""}></img>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center">
              <Link className="hover:underline  font-bold " href={product.website || ""} target="_blank">{product.name}</Link>
              {product.new &&
                <span className="flex items-center justify-center gap-1 ms-0.5 bg-blue-50 border border-blue-300 text-blue-600 text-[.6125rem] leading-4 uppercase align-middle rounded-full py-0.3 px-2 dark:bg-blue-900/70 dark:border-blue-700 dark:text-blue-500 font-semibold">NEW</span>
              }
            </div>
            <div className="text-sm text-muted-foreground">
              {getLocalizedTagline()}
            </div>
          </div>

          <div className="flex flex-row justify-end items-center gap-2">
            <Button variant={"ghost"} size={"icon"} disabled={favLoading} onClick={() => toggleFavoriteAction(product.uuid, cardType)}>
              {favLoading && <Spiner />}
              {!favLoading && <>
                {!isFavorite && <Bookmark strokeWidth={1.3} className="  text-gray-400 hover:text-gray-900 dark:hover:text-gray-50" />}
                {isFavorite && <Bookmark strokeWidth={1.3} fill="#f05f22" className=" text-[#f05f22]" />}
              </>}

            </Button>
            {
              cardType === "ph" && showExtra &&
              <div>
                <Link target="__blank" href={(product as MiniCardMetadata<"ph">).producthunt_url || ""}>
                  <UpVote voteCount={(product as MiniCardMetadata<"ph">).votesCount} />
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </>
}