'use client';
import MiniScreenshotCard from "./screenshot.card";
import useSWR, { SWRConfig } from 'swr';
import { Producthunt } from "@/db/schema/ph";
import Loading from "./list.loading";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ProductPageBlock = (props: {
  sortBy: 'time' | 'vote',
  topic: string,
  pageNum: number
}) => {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const { data: products, isLoading } = useSWR<Producthunt[]>(`/api/products/${props.topic}/${props.sortBy}/${props.pageNum}`, fetcher);

  return <>
    {isLoading && <Loading />}
    {!isLoading && products && <>
      <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
        {products?.map((ph) =>
          <MiniScreenshotCard key={ph.id} producthunt={ph} />
        )}
      </div>
    </>
    }
  </>
}

export default function ProductLists(props: {
  sortBy?: "time" | "vote",
  topic?: string,
  fallbackData?: any
}) {
  const [page, setPage] = useState(1);
  const sort = props.sortBy || "time";
  const topic = props.topic || "All";
  const infPages = [];
  for (let i = 0; i < page; i++) {
    infPages.push(<ProductPageBlock topic={topic} key={i} sortBy={sort} pageNum={i + 1} />)
  }
  return <>
    <SWRConfig>
      <div className='w-full flex flex-col' >
        {infPages}
        <div className="flex flex-row justify-center items-center p-10">
          <Button onClick={() => setPage(page + 1)}>Load More...</Button>
        </div>
      </div>
    </SWRConfig>
  </>
}