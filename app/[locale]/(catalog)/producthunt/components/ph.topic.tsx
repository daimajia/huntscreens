"use client";
import { Button } from "@/components/ui/button";
import { FlameIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslations } from 'next-intl';
import { Link, usePathname } from "@/i18n/routing";

export default function PHTopics(props: {
  selectedTag: string
}) {
  const t = useTranslations('Catalog.ProductHunt');
  const displayCategories: { [key: string]: string } = {
    "All": t("All"),
    "Design Tools": t("DesignTools"),
    "Open Source": t("OpenSource"),
    "Developer Tools": t("DeveloperTools"),
    "SaaS": t("SaaS"),
    "Artificial Intelligence": t("ArtificialIntelligence")
  }
  
  const [selected, setSelected] = useState(props.selectedTag);

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
    {Object.entries(displayCategories).map(([key, value]) => (
      <div key={key}>
        <Link href={pathname + `?` + createQueryString("topic", key)}>
          <Button onClick={() => setSelected(key)} className="" variant={selected === key ? "secondary" : "ghost"} size={"sm"}>
            {key === "Artificial Intelligence" && <FlameIcon color="red" size={15} className="mr-1" />}
            {value}
          </Button>
        </Link>
      </div>
    ))}
  </div>
}