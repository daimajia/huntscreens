import { Producthunt } from "@/db/schema/ph"

export type SortBy = 'time' | 'vote';

export type ProductDetailData = {
  product: Producthunt | null,
  next: Producthunt | null,
  prev: Producthunt | null
}