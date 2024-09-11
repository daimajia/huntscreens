import CategoryList from "@/components/category/category.list";
import MiniCardLoading from "@/components/ui-custom/skeleton/minicard.loading";
import { Suspense } from "react";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="flex flex-col w-[300px] md:fixed z-0 h-[calc(100vh-70px-20px)]">
        <div className="px-4 pt-5 font-bold text-lg uppercase">
          Categories
        </div>
        <CategoryList />
      </div>
      <div className="w-full md:ml-[300px]">
        <Suspense fallback={<MiniCardLoading />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}