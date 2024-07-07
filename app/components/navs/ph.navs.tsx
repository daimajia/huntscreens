"use client";
import { Button } from "@/components/ui/button";
import { Flame, FlameIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const displayCategories = [
  "All",
  "Design Tools",
  "Open Source",
  "Developer Tools",
  "SaaS",
  "Artificial Intelligence"
]

export default function PHTopics(props: {
  selectedTag: string
}) {
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
    {displayCategories.map((item) => <div key={item}>
      <Link href={pathname + `?` + createQueryString("topic", item)}>
        <Button onClick={() => setSelected(item)} className="" variant={selected === item ? "secondary" : "ghost"} size={"sm"}>
          {item === "Artificial Intelligence" && <FlameIcon color="red" size={15} className="mr-1" />}
          {item}
        </Button>
      </Link>
    </div>)}
  </div>
}