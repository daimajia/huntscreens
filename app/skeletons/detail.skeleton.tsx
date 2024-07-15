import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return <div className="flex flex-row w-full">
    <div className="w-full h-screen flex flex-col p-0 md:p-10">
      <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700  flex justify-start items-center space-x-1.5 px-3">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full h-screen overflow-auto  border-gray-200 dark:border-gray-600 border">
        <Skeleton className="w-full" />
      </div>
    </div>
    <div className="md:w-[500px] hidden md:flex flex-col pb-10  border rounded-lg my-10 border-r-0 rounded-r-none shadow-sm">

      <div className="absolute top-15 right-5">
      </div>

      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row gap-4 items-center  p-5 mt-10">
          <Skeleton className=" w-20 rounded-lg" />
          <div className="flex flex-col gap-1 ">
          </div>
        </div>
      </div>
      <div>
      </div>


      <div className="px-5">
        <Skeleton className="w-[200px] h-[100px]" />
      </div>

      <div className="p-5 flex flex-row gap-5">
        <Button className="w-full h-full" variant={"outline"}>GET IT</Button>
      </div>

    </div>
  </div>
}