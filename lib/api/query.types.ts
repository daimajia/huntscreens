import { Product } from "@/db/schema";

export type IndexDataPack = {
  products: Product[];
  totalCount: number;
  totalPages: number;
  mainslug: string;
  subSlug: string | undefined;
}