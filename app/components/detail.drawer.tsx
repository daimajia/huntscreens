import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Producthunt } from "@/db/schema/ph";
import { ReactNode, useState } from "react";
import ProductDetailPage from "./product.detail";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";

export default function DetailDrawer(props: {
  children: ReactNode,
  product: Producthunt
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter();
  useHotkeys("esc", () => {
    setOpen(false);
  });
  return <>
    <Drawer open={open} onClose={() => {
      router.back();
    }}>
      <DrawerTrigger asChild onClick={() => {
        setOpen(true);
      }}>
        {props.children}
      </DrawerTrigger>
      <DrawerContent>
        <ProductDetailPage product={props.product} />
      </DrawerContent>
    </Drawer>
  </>
}