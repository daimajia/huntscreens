"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import ProductBlock from "../../components/product.block";

export type StartupSortBy = "time" | "teamsize";

export default function StartupList(props: {
  sortBy: StartupSortBy
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(props.sortBy);
  const infPages = [];
  const [endpoint_url, setEndpointUrl] = useState(`/api/startups/yc/${sort}/1`)
  useEffect(() => {
    setEndpointUrl(`/api/startups/yc/${sort}/${page}`);
  }, [page, sort]);

  for (let i = 0; i < page; i++) {
    infPages.push(<ProductBlock key={i} cardType="startup" endpoint_url={endpoint_url} />);
  }
  return <>
    <SWRConfig>
      {infPages}
      <div className="flex flex-row justify-center items-center p-10">
        <Button onClick={() => setPage(page + 1)}>Load More...</Button>
      </div>
    </SWRConfig>
  </>
}