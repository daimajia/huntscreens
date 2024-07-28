"use client";
import { Suspense } from "react";
import YCSorter from "./components/startup.sort";
import YCFilter from "./components/startup.filter";
import { YCSearchParams } from "@/types/yc.types";
import Loading from "@/app/components/list.loading";
import ProductList from "../../components/product.list";


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
        <ProductList cardType="yc" genRequestUrl={(page) => `/api/startups/yc/${status}/${sort}/${page}`} />
      </Suspense>
    </div>
  </>
}