'use client';
import { SWRConfig } from 'swr';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductBlock from "../../components/product.block";

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
    infPages.push(<ProductBlock cardType="ph" key={i} endpoint_url={`/api/products/${topic}/${sort}/${i + 1}`} />)
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