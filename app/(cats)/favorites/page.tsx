"use client";
import { Suspense } from "react";
import Loading from "@/app/components/list.loading";
import ProductList from "../components/product.list";

export default function UserFavoritesPage() {
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <ProductList cardType="favorites" baseUrl="/api/favorites/{page}"/>
      </Suspense>
    </div>
  </>
}


