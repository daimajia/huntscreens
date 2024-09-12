"use client"
import {
  Sheet,
  SheetContent, SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import CategoryList from "../category/category.list"
import { Button } from "../ui/button"
import { MenuIcon } from "lucide-react"
import { useState } from "react"


export default function CategorySheet() {
  const [open, setOpen] = useState(false)
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <MenuIcon className="w-4 h-4" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Categories</SheetTitle>
      </SheetHeader>
      <div className="w-full h-[95vh] overflow-y-auto no-scrollbar">
        <CategoryList onClick={() => {
          setOpen(false)
        }} />
      </div>
    </SheetContent>
  </Sheet>
}