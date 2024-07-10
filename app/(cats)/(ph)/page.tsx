import Loading from "@/app/components/list.loading";
import PHTopics from "@/app/components/navs/ph.navs";
import SortDropdown from "@/app/components/sort.dropdown";
import { Suspense } from "react";
import ProductLists from "./components/product.list";

type PHProps = {
  topic: string,
  sort: "time" | "vote"
}

export default function PHPage({ searchParams }: {
  searchParams: {
    sort?: "time" | "vote",
    topic?: string
  },
}) {
  const sort = searchParams.sort || "time";
  const topic = searchParams.topic || "All";
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className='w-full px-5 flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between items-center'>
        <PHTopics selectedTag={topic} />
        <SortDropdown selectedValue={sort} />
      </div>

      <Suspense fallback={<Loading />}>
        <ProductLists sortBy={sort} topic={topic} />
      </Suspense>
    </div>
  </>
}