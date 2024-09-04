"use client";
import { Suspense } from "react";
import ProductList from "../components/product.list";
import Loading from "@/components/ui-custom/skeleton/list.loading";

export default function IndiehackersPage() {
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="indiehackers" baseUrl="/api/indiehackers/time/{page}"/>
      </Suspense>
    </div>
  </>
}