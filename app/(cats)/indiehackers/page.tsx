import Loading from "@/app/components/list.loading";
import { Suspense } from "react";
import IndiehackersList from "./components/indiehackers.list";


export default async function IndiehackersPage() {
  return <>
    <div className='flex flex-col gap-3 w-full'>
      <div className="flex flex-row justify-end px-3">
      </div>

      <Suspense fallback={<Loading />}>
        <IndiehackersList ihsort="time" />
      </Suspense>
    </div>
  </>
}