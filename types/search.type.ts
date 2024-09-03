import { ProductTypes } from "@/types/product.types";

export type SearchResult = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  website: string;
  thumb_url: string;
  uuid: string;
  itemType: ProductTypes;
};