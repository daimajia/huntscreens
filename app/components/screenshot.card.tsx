/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import UpVote from "./upvote";
import { ProductTypes } from "../types/product.types";


type BaseMiniCardMetadata = {
  id: number,
  name: string,
  uuid: string,
  thumbnail: string | null,
  tagline: string | null,
  website: string
}

type ProductHuntMetadata = {
  votesCount: number,
  producthunt_url: string
}

export type MiniCardMetadata<T> = T extends 'ph' ? BaseMiniCardMetadata & ProductHuntMetadata : BaseMiniCardMetadata;

interface MiniCardProps<T extends ProductTypes> {
  cardType: T,
  product: MiniCardMetadata<T>
}

export default function MiniScreenshotCard<T extends ProductTypes>({ cardType, product }: MiniCardProps<T>) {
  const page_url = cardType === "ph" ? `/p/${product.id}` : `/startup/yc/${product.id}`;
  return <>
    <div className={`flex flex-col gap-5 hover:bg-muted p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <Link passHref key={product.id} href={page_url}>
          <img alt="" loading="lazy" className=" h-[40vh] object-cover object-top w-full rounded-t-lg border-gray-400/20 border" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product.uuid}.webp` || ""}></img>
        </Link>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img alt={""} loading="lazy" className="h-10 rounded-md" src={product.thumbnail || ""}></img>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className=" font-bold ">
              <Link className="hover:underline" href={product.website || ""} target="_blank">{product.name}</Link>
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