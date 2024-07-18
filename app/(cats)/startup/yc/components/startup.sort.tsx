"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YCSortBy } from "@/types/yc.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function YCSorter(props: {
  sort: YCSortBy
}) {
  const router = useRouter();
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


  return <>
    <Select defaultValue={props.sort} onValueChange={(value) => {
      router.push(pathname + "?" + createQueryString("sort", value));
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="time">Launch Time</SelectItem>
        <SelectItem value="teamsize">Team Size</SelectItem>
      </SelectContent>
    </Select>
  </>
}