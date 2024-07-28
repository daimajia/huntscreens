"use client";
import Loading from "@/app/components/list.loading";
import { Suspense } from "react";
import { YCSortBy } from "../../../types/yc.types";
import ProductList from "../components/product.list";


export default function TaaftPage({ searchParams }: {
  searchParams: {
    sort?: YCSortBy
  }
}) {
  const sort = searchParams.sort || "time";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="taaft" genRequestUrl={(page) => `/api/taafts/${page}`} />
      </Suspense>
    </div>
  </>
}