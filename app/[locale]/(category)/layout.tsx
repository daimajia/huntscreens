import Header from "@/components/layout/header"
import Loading from "@/components/ui-custom/skeleton/list.loading"
import { Suspense } from "react"

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex flex-col w-full max-w-[1480px] mx-auto mt-5">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}