"use client";
import useSWR from "swr";
import Loading from "../../components/list.loading";
import MiniScreenshotCard from "../../components/screenshot.card";
import { ApiReturnDataType, generatedata, ProductTypes } from "@/app/types/product.types";
import { FavoritesWithDetail } from "@/db/schema";
import { useEffect } from "react";
import { useFavoriteStore } from "@/stores/favorites.provider";

type PageBlockProps<T extends ProductTypes> = {
  cardType: T | 'favorites',
  endpoint_url: string,
  onEnd: () => void;
}

export default function ProductBlock<T extends ProductTypes>({ cardType, endpoint_url, onEnd }: PageBlockProps<T>) {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, isLoading, error } = useSWR(endpoint_url, fetcher);
  const { favoriteIds, pushFavorites, queryFavorite, toggleFavorite } = useFavoriteStore(state => ({
    favoriteIds: state.favoriteIds,
    queryFavorite: state.query,
    toggleFavorite: state.toggleFavorite,
    pushFavorites: state.pushFavorites,
  }));

  useEffect(() => {
    if (!data) return;
    if (cardType === "favorites") {
      const itemIds = data.map((item: FavoritesWithDetail) => {
        const itemType = item.itemType as ProductTypes;
        const product = item[itemType];
        return product?.uuid;
      })
      pushFavorites(itemIds);
    } else {
      const itemIds = (data as ApiReturnDataType<T>[]).map(item => item.uuid || "");
      queryFavorite(itemIds);
    }
  }, [data, cardType, queryFavorite, pushFavorites]);
  if (error || (data && data?.length < 30)) {
    onEnd()
  }

  return <>
    {isLoading && <Loading />}
    <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
      {!isLoading && data && cardType !== "favorites" && <>
        {data.map((item: ApiReturnDataType<T>) => <MiniScreenshotCard isFavorite={favoriteIds.includes(item.uuid || "")} key={item.id} cardType={cardType} product={generatedata(cardType, item)} />)}
      </>}

      {!isLoading && data && cardType === "favorites" && <>
        {data.map((item: FavoritesWithDetail) => {
          const itemType = item.itemType as ProductTypes;
          const product = item[itemType];
          if (product)
            return <MiniScreenshotCard isFavorite={favoriteIds.includes(product.uuid || "")} key={product.uuid} cardType={itemType} product={generatedata(itemType, product)} />
          else {
            return <>Error</>
          }
        })}
      </>}
    </div>
  </>
}