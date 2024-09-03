/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { intro, Producthunt, YC } from "@/db/schema";
import { ProductModel, ProductTypes, thumbailGetter } from "@/types/product.types";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import SiteBreadcrumb from "./breadcrumb";
import AIIntro from "./ai.intro";
import Link from "next/link";
import YCInfoBadge from "./yc.info.badge";
import { Badge } from "@/components/ui/badge";
import NextPrevCard from "./next.prev.card";
import SimilarProducts from "./similar.products";
import Logo from "@/components/logo";
import WeeklyTop from "./weekly.top";

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
      <div className="flex-col max-w-7xl mx-auto gap-5">

        <div className="flex flex-row gap-5 px-5 md:px-10 pt-5 md:pt-10">
          <SiteBreadcrumb productType={props.productType} />
        </div>

        <div className="flex md:flex-row w-full flex-col gap-10 p-5 md:p-10">

          <div className="flex flex-col gap-5 w-full">

            <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex flex-row gap-5">
                <div className="w-20">
                  <Logo name={product.name || ""} url={thumbnail || ""} className="w-20 h-20" />
                </div>
                
                <div className="flex flex-col w-full justify-between">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-row items-center justify-between gap-4">
                      <Link href={product.website || ""} target="_blank">
                        <h1 className="text-3xl md:text-5xl font-bold break-words hover:underline">
                          {product.name}
                        </h1>
                      </Link>
                      <Link href={product.website || ""} target="_blank">
                        <Button variant={"outline"} className="hidden md:flex bg-[#f05f22] hover:bg-[#ff5e00] text-white hover:text-white">
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

              <div className="flex w-full flex-row justify-end gap-3">
                {(product as Producthunt).topics?.nodes.map((item) =>
                  <Badge key={item.name} className="py-1 text-slate-500 dark:text-white border dark:border-gray-400" variant="outline">{item.name}</Badge>
                )}
              </div>
            </div>


            {props.productType === "yc" && <>
              <div className="bg-white dark:bg-gray-800 border rounded-lg">
                <YCInfoBadge yc={(product as YC)} />
              </div>
            </>}

            <div className="md:hidden">
              <Link href={product.website || ""} target="_blank" className="w-full">
                <Button variant={"outline"} className="w-full flex md:hidden bg-[#f05f22] hover:bg-[#ff5e00] text-white hover:text-white">
                  Visit the Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div>
              <img className="h-[500px] w-full object-cover object-top border rounded-lg" alt={`${product.name} screenshot`} loading="lazy" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`} />
            </div>



            {productIntro &&
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-5">
                <div className=" text-2xl mb-5 font-bold">
                  More About {product.name}
                </div>
                <AIIntro uuid={product.uuid!} />
              </div>
            }

            <div>
              <NextPrevCard productType={props.productType} next={props.next} prev={props.prev} />
            </div>
          </div>


          <div className=" w-full md:w-[400px] gap-5 flex flex-col">
            <SimilarProducts uuid={product.uuid!} description={product.description || ""} name={product.name || ""} />
            <WeeklyTop />
          </div>
        </div>
      </div>
    </div>
  </>
}