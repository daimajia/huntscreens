"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupSortBy } from "./startup.list";
import { useRouter } from "next/navigation";


export default function YCSorter(props: {
  sort: StartupSortBy
}) {
  const router = useRouter();
  return <>
    <Select defaultValue={props.sort} onValueChange={(value) => {
      router.push("?sort=" + value);
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="time">Launch Time</SelectItem>
        <SelectItem value="teamsize">Team Size</SelectItem>
      </SelectContent>
    </Select>
  </>
}