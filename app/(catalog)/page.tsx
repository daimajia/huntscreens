import { Suspense } from "react";
import ProductList from "./components/product.list";
import Loading from "@/components/ui-custom/skeleton/list.loading";

export default function JustLaunchedPage() {
  return (
    <div className='flex flex-col gap-3 w-full'>
      <h1 className="text-3xl font-bold px-5 mb-5">Just Launched</h1>
      <Suspense fallback={<Loading />}>
        <ProductList cardType="just-launched" baseUrl="/api/just-launched/{page}" />
      </Suspense>
    </div>
  );
}
