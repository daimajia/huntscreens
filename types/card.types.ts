import { TranslationContent } from "@/db/schema/types";
import { SupportedLangs } from "@/i18n/types";
import { ProductTypes } from "@/types/product.types";

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