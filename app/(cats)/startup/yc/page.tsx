import { Suspense } from "react";
import Loading from "../../../components/list.loading";
import StartupList from "./components/startup.list";
import YCSorter from "./components/startup.sort";
import YCFilter from "./components/startup.filter";
import { YCSearchParams } from "../../../../types/yc.types";


export default async function YCPage({ searchParams }: {
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
        <StartupList sort={sort} status={status} />
      </Suspense>
    </div>
  </>
}