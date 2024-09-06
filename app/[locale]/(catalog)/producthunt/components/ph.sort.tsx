"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function SortDropdown({ selectedValue }: {
  selectedValue: 'time' | 'vote'
}) {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("Catalog.ProductHunt");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return <>
    <Select defaultValue={selectedValue} onValueChange={(value) => {
      router.push(pathname + "?" + createQueryString("sort", value));
    }}>
      <SelectTrigger className="md:w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="time">{t("SortByTime")}</SelectItem>
        <SelectItem value="vote">{t("SortByVotes")}</SelectItem>
      </SelectContent>
    </Select>
  </>
}