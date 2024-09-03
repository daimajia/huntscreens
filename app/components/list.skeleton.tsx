import { Skeleton } from "@/components/ui/skeleton"

export const CardSkeleton = () => {
  return <>
    <div className={`flex flex-col gap-5 hover:bg-muted p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <Skeleton className=" h-[250px] object-cover object-top w-full rounded-t-lg border-muted border"></Skeleton>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <Skeleton className="w-10 h-10 rounded-md" />
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div>
            <Skeleton className="h-4 w-[20px]" />
          </div>
        </div>
      </div>
    </div>

  </>
}