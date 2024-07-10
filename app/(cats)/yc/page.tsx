import { Suspense } from "react";
import Loading from "../../components/list.loading";
import StartupList, { StartupSortBy } from "./components/startup.list";

export default async function YCPage({searchParams}: {
  searchParams: {
    sort? : StartupSortBy
  }
}) {
  console.log(searchParams.sort);
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className='w-full px-5 flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between items-center'>

      </div>

      <Suspense fallback={<Loading />}>
        <StartupList sortBy={searchParams.sort || "time"} />
      </Suspense>
    </div>
  </>
}