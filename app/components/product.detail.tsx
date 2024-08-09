/* eslint-disable @next/next/no-img-element */
import { Producthunt } from "@/db/schema/ph";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoBack from "./back.button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { intro, YC } from "@/db/schema";
import { ProductModel, ProductTypes, thumbailGetter, urlMapper } from "../types/product.types";
import YCInfoBadge from "./yc.info.badge";
import AIIntro from "./ai.intro";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";

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
    <div className="flex flex-row w-full">
      <div className="w-full flex flex-col p-0 md:p-10">
        <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700  flex justify-start items-center space-x-1.5 px-3">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full   border-gray-200 dark:border-gray-600 border">
          <img alt={`${product.name} screenshot`} loading="lazy" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`}></img>
        </div>
      </div>
      <div className="md:w-[700px] hidden md:flex flex-col pb-10  border rounded-lg my-10 border-r-0 rounded-r-none shadow-sm">

        <div className="absolute top-15 right-5">
          <GoBack buttonAction="home" className=" border-t-0 rounded-t-none hover:border-t" />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-row gap-4 items-center  p-5 mt-10">
            <img alt={`${product.name} thumbnail`} loading="lazy" src={thumbnail || ""} className=" w-20 rounded-lg" />
            <div className="flex flex-col gap-1 ">
              <Link href={product.website || ""} target="__blank" className="hover:underline">
                <h1 className=" text-xl font-semibold">
                  {product?.name}
                </h1>
              </Link>
              <h2 className="  text-slate-600 dark:text-white/80">
                {product?.tagline}
              </h2>
            </div>
          </div>
        </div>
        <div>
        </div>

        {props.productType === "yc" && <>
          <YCInfoBadge yc={(product as YC)} />
        </>}


        {!productIntro &&
          <div className="px-5">
            <h2 className="text-slate-500 dark:text-white/80">
              {product?.description}
            </h2>
          </div>
        }


        {productIntro &&
          <div className="px-5">
            <AIIntro uuid={product.uuid!} />
          </div>
        }


        {product && props.productType === "ph" &&
          <div className="p-5 gap-2 flex flex-wrap">
            {(product as Producthunt).topics?.nodes.map((item) =>
              <Badge key={item.name} className="py-1 text-slate-500" variant="outline">{item.name}</Badge>
            )}
          </div>
        }

        <div className="p-5 flex flex-row gap-5">
          <Link className="w-full h-full" href={product?.website || ""} target="__blank">
            <Button className="w-full h-full" variant={"outline"}>
              GET IT
            </Button>
          </Link>
          {props.productType === "ph" &&
            <Link className="w-full h-full" href={(props.product as Producthunt)?.url || ""} target="__blank">
              <Button className="w-full border" variant={"outline"}>VOTE ({(props.product as Producthunt)?.votesCount || ""})</Button>
            </Link>
          }

        </div>


        <div className="flex h-full items-end px-5">
          <div className="w-full flex flex-row justify-start gap-4">
            {props.prev &&
              <Link href={urlMapper[props.productType](props.prev.id)} shallow={true}>
                <Button variant={"outline"} size={"icon"} className="rounded-full" >
                  <ChevronLeft strokeWidth={1.5} color="gray" className=" w-6 h-6" />
                </Button>
              </Link>
            }

            {props.next &&
              <Link href={urlMapper[props.productType](props.next.id)} shallow={true}>
                <Button variant={"outline"} size={"icon"} className="rounded-full" >
                  <ChevronRight strokeWidth={1.5} color="gray" className=" w-6 h-6" />
                </Button>
              </Link>
            }

          </div>
        </div>
      </div>
    </div>
  </>
}