import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return  <div className="flex flex-row w-full">
  <div className="w-full h-screen flex flex-col p-0 md:p-10">
    <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700 flex items-center px-3 justify-between">
      <div className="space-x-1.5 flex flex-row gap-1">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        <Button size="icon" variant="ghost" className="rounded-full">
          <Skeleton className="h-5 w-5 rounded-full" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Skeleton className="h-5 w-5 rounded-full" />
        </Button>
      </div>
    </div>
    <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full h-screen overflow-auto border-gray-200 dark:border-gray-600 border">
      <Skeleton className="w-full h-full" />
    </div>
  </div>

  <div className="md:flex md:w-[500px] hidden h-screen">
    <div className="my-10 md:flex flex-col border rounded-lg border-r-0 rounded-r-none shadow-sm pb-5 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center p-5 mt-10 justify-start">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="px-5 overflow-auto min-h-10">
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="p-5 gap-2 flex flex-wrap">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-20" />
        ))}
      </div>

      <div className="p-5 flex gap-5 grow">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex items-end px-5 min-h-10">
        <div className="w-full flex flex-row justify-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</div>
}