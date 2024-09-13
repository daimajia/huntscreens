import { Skeleton } from "@/components/ui/skeleton"

const MiniCardSkeleton = () => (
  <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden h-full">
    <Skeleton className="w-full h-48" />
    <div className="p-4 flex flex-col h-full">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <div className="mt-auto flex justify-end">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  </div>
)

export default function MiniCardLoading() {
  return (
    <div className="min-w-full max-h-full">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 py-5">
          {Array(9).fill(0).map((_, index) => (
            <MiniCardSkeleton key={index} />
          ))}
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  )
}