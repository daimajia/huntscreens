import { CardSkeleton } from "./list.skeleton";

export default function Loading() {
  // Or a custom loading skeleton component
  return <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:gap-3 gap-5 w-full'>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
}