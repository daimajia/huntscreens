/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import UpVote from "./upvote";
import { ProductTypes, urlMapper } from "../types/product.types";
import { useMediaQuery } from 'usehooks-ts';

export type BaseMiniCardMetadata = {
  id: number,
  name: string,
  uuid: string,
  thumbnail: string | null,
  tagline: string | null,
  website: string,
  new: boolean
}

type ProductHuntMetadata = {
  votesCount: number,
  producthunt_url: string
}

export type MiniCardMetadata<T extends ProductTypes> = T extends 'ph' ? BaseMiniCardMetadata & ProductHuntMetadata : BaseMiniCardMetadata;

interface MiniCardProps<T extends ProductTypes> {
  cardType: T,
  product: MiniCardMetadata<T>
}

export default function MiniScreenshotCard<T extends ProductTypes>({ cardType, product }: MiniCardProps<T>) {
  const matches = useMediaQuery("(min-width: 768px)", { defaultValue: true });
  return <>
    <div className={`flex flex-col gap-5 hover:bg-muted p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <Link passHref key={product.id} href={matches ? urlMapper[cardType](product.id) : product.website}>
          <img alt="" loading="lazy" className=" h-[40vh] object-cover object-top w-full rounded-t-lg border-gray-400/20 border" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product.uuid}.webp` || ""}></img>
        </Link>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img alt={""} loading="lazy" className="h-10 rounded-md" src={product.thumbnail || ""}></img>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center">
              <Link className="hover:underline  font-bold " href={product.website || ""} target="_blank">{product.name}</Link>
              {product.new &&
                <span className="flex items-center justify-center gap-1 ms-0.5 bg-blue-50 border border-blue-300 text-blue-600 text-[.6125rem] leading-4 uppercase align-middle rounded-full py-0.3 px-2 dark:bg-blue-900/70 dark:border-blue-700 dark:text-blue-500 font-semibold">NEW</span>
              }
            </div>
            <div className=" text-muted-foreground">
              {product.tagline}
            </div>
          </div>

          {
            cardType === "ph" &&
            <div>
              <Link target="__blank" href={(product as MiniCardMetadata<"ph">).producthunt_url || ""}>
                <UpVote voteCount={(product as MiniCardMetadata<"ph">).votesCount} />
              </Link>
            </div>
          }
        </div>
      </div>
    </div>
  </>
}