'use client';
import ProductDetailModal from "@/app/components/product.detail.modal";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useState } from "react";

export default function ShowModal({ params: { id: pid } }: { params: { id: string } }) {
  const [open, setOpen] = useState(true);

  return <>
    <Drawer open={open}>
      <DrawerContent className=" max-w-full max-h-full" aria-describedby={"product"}>
        <ProductDetailModal productId={pid} />
      </DrawerContent>
    </Drawer>
  </>
}