import { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SWRConfig } from "swr";
import ProductBlock from "./product.block";
import { ProductTypes } from "@/app/types/product.types";
import { Button } from "@/components/ui/button";


type ProductListProps<T extends ProductTypes> = {
  cardType: T,
  fallbackData?: any,
  genRequestUrl: (page: number) => string
}

export default function ProductList<T extends ProductTypes>(
  { cardType, fallbackData, genRequestUrl }: ProductListProps<T>
) {
  const [page, setPage] = useState(1);
  const [isEnded, setIsEnded] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0
  });

  const loadMore = useCallback(() => {
    if (!isEnded)
      setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    if (inView && !isEnded) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <SWRConfig value={{ fallbackData: fallbackData }}>
      <div className='w-full flex flex-col space-y-4'>
        {[...Array(page)].map((_, i) => (
          <ProductBlock
            cardType={cardType}
            key={i}
            endpoint_url={genRequestUrl(i + 1)}
            ended={(isEnd) => setIsEnded(isEnd)}
          />
        ))}
        <div className="flex justify-center items-center p-10" ref={ref}>
          {!isEnded && <Button onClick={loadMore}>Load More...</Button>}
          {isEnded && <span className=" text-lg font-semibold">❤️</span>}
        </div>
      </div>
    </SWRConfig>
  );
}