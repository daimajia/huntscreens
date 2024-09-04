"use client";
import { Suspense } from "react";
import YCSorter from "./components/startup.sort";
import YCFilter from "./components/startup.filter";
import { YCSearchParams } from "@/types/yc.types";
import ProductList from "../../components/product.list";
import Loading from "@/components/ui-custom/skeleton/list.loading";

export default function YCPage({ searchParams }: {
  searchParams: YCSearchParams
}) {
  const sort = searchParams.sort || "time";
  const status = searchParams.status || "All";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
        <YCFilter selectedTag={status} />
        <YCSorter sort={sort} />
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="yc" baseUrl={`/api/startups/yc/${status}/${sort}/{page}`} />
      </Suspense>
    </div>
  </>
}