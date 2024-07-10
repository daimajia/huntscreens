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
  const [endpoint_url, setEndpointUrl] = useState(`/api/products/${props.topic}/${props.sortBy}/1`)

  useEffect(() => {
    setEndpointUrl(`/api/products/${topic}/${sort}/${page}`);
  }, [page, sort, topic]);

  for (let i = 0; i < page; i++) {
    infPages.push(<ProductBlock cardType="ph" key={i} endpoint_url={endpoint_url} />)
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