'use client';
import ProductDetailModal from "@/app/components/product.detail.modal";
import { Drawer, DrawerContent, DrawerOverlay, DrawerPortal } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShowModal({ params: { id: pid } }: { params: { id: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  return <>
    <Drawer open={open} onClose={() => { router.back() }}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-gray-500/10" />
        <DrawerContent className="flex flex-col rounded-t-[10px] md:rounded-t-none h-[80%] md:h-[100%] mt-24 fixed bottom-0 left-0 right-0" aria-describedby={"product"}>
          <ProductDetailModal productId={pid} />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </>
}