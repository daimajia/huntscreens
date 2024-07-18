import Loading from "@/app/components/list.loading";
import { Suspense } from "react";
import TaaftList from "./components/taaft.list";
import { YCSortBy } from "../../../types/yc.types";


export default async function TaaftPage({ searchParams }: {
  searchParams: {
    sort?: YCSortBy
  }
}) {
  const sort = searchParams.sort || "time";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
        {/* <YCSorter sort={sort} /> */}
      </div>

      <Suspense fallback={<Loading />}>
        <TaaftList />
      </Suspense>
    </div>
  </>
}