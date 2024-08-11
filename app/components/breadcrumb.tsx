import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { ProductTypes } from "../types/product.types";
import Link from "next/link";

export default function SiteBreadcrumb({productType}: {productType: ProductTypes}) {
  let rootPath;
  let pathName;
  switch (productType) {
    case "ph":
      rootPath = "/";
      pathName = "ProductHunt";
      break;
    case "indiehackers":
      rootPath = "/indiehackers";
      pathName = "IndieHackers";
      break;
    case "yc":
      rootPath = "/startup/yc";
      pathName = "Y Combinator";
      break;
    case "taaft":
      rootPath = "/taaft";
      pathName = "TAAFT";
      break;
  }
  return <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Slash />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={rootPath}>{pathName}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
}