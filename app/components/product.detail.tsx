/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { intro } from "@/db/schema";
import { ProductModel, ProductTypes, thumbailGetter } from "../types/product.types";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import SiteBreadcrumb from "./breadcrumb";
import AIIntro from "./ai.intro";
import Link from "next/link";

export default async function ProductDetailPage<T extends ProductTypes>(props: {
  productType: T,
  product: ProductModel<T>,
  next?: ProductModel<T> | null,
  prev?: ProductModel<T> | null
}) {
  const product = props.product;
  const thumbnail = thumbailGetter(props.productType, props.product);
  const productIntro = await db.query.intro.findFirst({
    where: and(
      eq(intro.uuid, product.uuid!),
      eq(intro.deleted, false)
    )
  });
  return <>
    <div className=" bg-gray-100 dark:bg-gray-900">
      <div className="flex-col max-w-5xl mx-auto gap-5 ">

        <div className="flex flex-row gap-5 px-10 pt-10">
          <SiteBreadcrumb productType={props.productType} />
        </div>

        <div className="flex md:flex-row flex-col gap-10 p-10">

          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex flex-row gap-5">
                <img alt={`${product.name} thumbnail`} loading="lazy" src={thumbnail || ""} className="w-20 rounded-full border" />

                <div className="flex flex-col w-full justify-between">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-row items-center justify-between gap-4">
                      <Link href={product.website || ""} target="_blank">
                        <h1 className="text-3xl md:text-5xl font-bold break-words hover:underline">
                          {product.name}
                        </h1>
                      </Link>
                      <Link href={product.website || ""} target="_blank">
                        <Button variant={"outline"} className="hidden md:flex">
                          Visit the Website
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    <h2>
                      {product.tagline}
                    </h2>
                  </div>
                </div>
              </div>
              <div>
                <h3 className=" text">{product.description}</h3>
              </div>
            </div>

            <div className="md:hidden">
              <Link href={product.website || ""} target="_blank" className="w-full">
                <Button variant="outline" className="w-full">
                  Visit the Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div>
              <img className="h-[500px] w-full object-cover object-top border rounded-lg" alt={`${product.name} screenshot`} loading="lazy" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`} />
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-5">
              {productIntro && <div>
                <div className=" text-2xl mb-5 font-bold">
                  More About {product.name}
                </div>
                <AIIntro uuid={product.uuid!} />
              </div>
              }
            </div>
          </div>


          {/* <div className="md:w-1/3 relative border">
          </div> */}
        </div>
      </div>
    </div>
  </>
}