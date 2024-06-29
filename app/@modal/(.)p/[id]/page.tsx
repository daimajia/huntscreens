'use client';
import ProductDetailPage from "@/app/components/product.detail";
import DetailSkeleton from "@/app/skeletons/detail.skeleton";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";

export default function ShowModal({ params: { id: pid } }: { params: { id: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const fetcher = (url: string) => fetch(url).then(r => r.json())

  const { data: product, isLoading } = useSWR("/api/product/" + pid, fetcher);
  useHotkeys('esc', () => {
    setOpen(false);
  })

  return <>
    <Drawer onClose={() => {
      router.back();
    }} open={open}>
      <DrawerTitle></DrawerTitle>
      <DrawerContent aria-describedby={isLoading ? "loading" : product.uuid}>
        {isLoading ? <>
          <DetailSkeleton />
        </> : <>
          <ProductDetailPage product={product} />
        </>}

      </DrawerContent>
    </Drawer>
  </>
}