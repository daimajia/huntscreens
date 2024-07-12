import { Suspense } from "react";
import Loading from "../../../components/list.loading";
import StartupList, { StartupSortBy } from "./components/startup.list";
import YCSorter from "./components/startup.sort";

export default async function YCPage({ searchParams }: {
  searchParams: {
    sort?: StartupSortBy
  }
}) {
  const sort = searchParams.sort || "time";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
        <YCSorter sort={sort} />
      </div>

      <Suspense fallback={<Loading />}>
        <StartupList sortBy={sort} />
      </Suspense>
    </div>
  </>
}