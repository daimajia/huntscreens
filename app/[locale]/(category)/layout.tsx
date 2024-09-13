import CategoryList from "@/components/category/category.list"
import Header from "@/components/layout/header"

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex flex-col w-full max-w-[1440px] mx-auto mt-5">
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="hidden md:flex flex-col w-[300px] md:fixed z-0 h-[calc(100vh-70px-20px)]">
            <div className="px-4 py-5 font-bold text-lg uppercase">
              <h2>Categories</h2>
            </div>
            <CategoryList />
          </div>
          <div className="w-full md:ml-[300px]">
            {children}
          </div>
        </div>
      </main>

    </div>
  )
}