
export type SortBy = 'time' | 'vote';

export type ProductDetailData<T> = {
  product: T | null,
  next: T | null,
  prev: T | null
}