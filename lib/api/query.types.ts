import { JustLaunchedProduct } from "@/types/product.types";

export type IndexDataPack = {
  products: JustLaunchedProduct[];
  totalCount: number;
  totalPages: number;
  mainslug: string;
  subSlug: string | undefined;
}