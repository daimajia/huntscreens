"use client";
import { Button } from "@/components/ui/button";
import { CoinsIcon, Skull, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";


export default function YCFilter(props: {
  selectedTag: string
}) {
  const t = useTranslations("Catalog.YC");
  const [selected, setSelected] = useState(props.selectedTag);

  const displayCategories: { [key: string]: string } = {
    "All": t("All"),
    "Public": t("Public"),
    "Acquired": t("Acquired")
  }


  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return <div className="flex flex-row pb-5 md:pb-0 gap-1 w-full overflow-auto">
    {Object.keys(displayCategories).map(key => (
      <div key={key}>
        <Link href={pathname + `?` + createQueryString("status", displayCategories[key])}>
          <Button onClick={() => setSelected(key)} className="" variant={selected === key ? "secondary" : "ghost"} size={"sm"}>
            {key === "Died" && <Skull color="red" size={15} className="mr-1" />}
            {key === "Public" && <TrendingUp color="green" size={15} className="mr-1" />}
            {key === "Acquired" && <CoinsIcon size={15} className="mr-1 dark:text-white text-gray-600" />}
            {displayCategories[key]}
          </Button>
        </Link>
      </div>
    ))}
  </div>
}