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
  const infPages = [];
  for (let i = 0; i < page; i++) {
    infPages.push(<ProductBlock key={i} cardType="startup" endpoint_url={`/api/startups/yc/${props.sortBy}/${i + 1}`} />);
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