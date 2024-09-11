import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ProductTypes } from "@/types/product.types";
import React from "react";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

export type BreadcrumbItem = {
  name?: string;
  href: string;
}

type BreadcrumbProps = {
  items: BreadcrumbItem[];
}

export async function SiteBreadcrumbGenerator({ items }: BreadcrumbProps) {
  if (items.length === 0) return <></>;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.name || 'Untitled'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                /
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function SiteBreadcrumb({ productType }: { productType: ProductTypes }) {
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