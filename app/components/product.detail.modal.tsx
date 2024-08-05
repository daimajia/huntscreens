/* eslint-disable @next/next/no-img-element */
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Link2Icon, SquareArrowOutUpRight } from "lucide-react";
import useSWR from "swr";
import { getCookie } from 'cookies-next';
import { ProductDetailData } from "../types/api.types";
import DetailSkeleton from "../skeletons/detail.skeleton";
import { useEffect, useState } from "react";
import { Producthunt } from "@/db/schema/ph";
import GoBack from "./back.button";
import Spiner from "../skeletons/loading.spin";
import { YC } from "@/db/schema";
import { ProductModel, ProductTypes, thumbailGetter, urlMapper } from "../types/product.types";
import YCInfoBadge from "./yc.info.badge";


export default function ProductDetailModal<T extends ProductTypes>(props: {
  productType: T,
  productId: string,
}) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())

  const [currentPid, setCurrentPid] = useState(props.productId);
  const [product, setCurrentProduct] = useState<ProductModel<T> | null>(null);

  let requestUrl = "";
  switch (props.productType) {
    case "ph":
      const ph_sort = getCookie("sort") || "time";
      const topic = getCookie('topic') || "All";
      requestUrl = `/api/product/${topic}/${ph_sort}/${currentPid}`
      break;
    case "yc":
      const yc_sort = getCookie('yc.sort') || "time";
      const yc_status = getCookie('yc.status') || "All";
      requestUrl = `/api/startup/yc/${yc_status}/${yc_sort}/${currentPid}`;
      break;
    case "indiehackers":
      const ih_sort = getCookie('ih.sort') || "time";
      requestUrl = `/api/indiehacker/${ih_sort}/${currentPid}`;
  }

  const { data, isLoading } = useSWR<ProductDetailData<ProductModel<T>>>(`${requestUrl}`, fetcher);

  useEffect(() => {
    if (!product) return;
    let replaceUrl = "";
    replaceUrl = urlMapper[props.productType](currentPid);

    window.history.replaceState(null, '', replaceUrl);
    if (product && product.id.toString() !== currentPid) {
      setCurrentPid(product.id.toString());
    }
  }, [product, currentPid, props.productType]);

  useEffect(() => {
    if (data && data.product && data.product.id !== product?.id) {
      setCurrentProduct(data.product);
    }
  }, [data, product]);

  if (!product) return <DetailSkeleton />

  const next = data?.next || null;
  const prev = data?.prev || null;

  const prevProduct = () => {
    if (!prev) return;
    setCurrentPid(prev.id.toString());
    setCurrentProduct(prev);
  };

  const nextProduct = () => {
    if (!next) return;
    setCurrentPid(next.id.toString());
    setCurrentProduct(next);
  }

  return <>
    <div className="flex flex-row w-full">
      <div className="w-full h-screen flex flex-col p-0 md:p-10">
        <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700  flex items-center px-3 justify-between">
          <div className="space-x-1.5  flex flex-row gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="md:hidden">
              <Link href={product.website || ""} target="__blank">
                <Button size={"icon"} variant={"ghost"} className="rounded-full">
                  <SquareArrowOutUpRight color="gray" className=" w-5 h-5" />
                </Button>
              </Link>
            </div>
            {isLoading &&
              <Spiner className="mr-5 dark:text-white/80 text-slate-500" />
            }
            {!isLoading &&
              <Link href={product.website!} target="__blank">
                <Button size={"icon"} variant={"ghost"} className=" rounded-full">
                  <Link2Icon strokeWidth={1.5} className=" w-6 h-6 dark:text-white/80 text-slate-500" />
                </Button>
              </Link>
            }


            {prev &&
              <Button onClick={prevProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronLeft strokeWidth={1.5} className=" w-6 h-6 dark:text-white/80 text-slate-500" />
              </Button>
            }
            {next &&
              <Button onClick={nextProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronRight strokeWidth={1.5}  className=" w-6 h-6 dark:text-white/80 text-slate-500" />
              </Button>
            }


          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full h-screen overflow-auto  border-gray-200 dark:border-gray-600 border">
          <img alt={`${product.name} - screenshot`} loading="lazy" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`}></img>
        </div>
      </div>

      <div className="md:flex md:w-[500px] hidden h-screen">
        <div className="my-10 md:flex flex-col  border rounded-lg border-r-0 rounded-r-none shadow-sm pb-5">
          <div className="absolute top-15 right-5">
            <GoBack className=" border-t-0 rounded-t-none hover:border-t" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center p-5 mt-10 justify-start">
              <div>
                {product &&
                  <img alt={`${product.name} thumbnail`} loading="lazy" src={thumbailGetter(props.productType, product) || ""} className=" w-20 rounded-lg border" />
                }
              </div>
              <div className="flex flex-col gap-1 ">
                <h1 className=" text-xl font-semibold">
                  <Link className="hover:underline" href={product.website || ""}>{product?.name}</Link>
                </h1>
                <h2 className="  text-slate-600 dark:text-slate-200">
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


          <div className="px-5 overflow-auto min-h-10">
            <h2 className="text-slate-600 dark:text-slate-300">
              {product?.description}
            </h2>
          </div>

          {product && props.productType === "ph" &&
            <div className="p-5 gap-2 flex flex-wrap">
              {(product as Producthunt).topics?.nodes.map((item) =>
                <Badge key={item.name} className="py-1 text-slate-500" variant="outline">{item.name}</Badge>
              )}
            </div>
          }

          <div className="p-5 flex gap-5 grow">
            <Link className="w-full" href={product?.website || ""} target="__blank">
              <Button className="w-full" variant={"outline"}>
                GET IT
              </Button>
            </Link>
            {product && props.productType === "ph" &&
              <Link className="w-full h-full" href={(product as Producthunt)?.url || ""} target="__blank">
                <Button className="w-full border" variant={"outline"}>VOTE ({(product as Producthunt)?.votesCount || ""})</Button>
              </Link>
            }

          </div>


          <div className="flex items-end px-5 min-h-10">
            <div className="w-full flex flex-row justify-start gap-4">
              {prev &&
                <Button onClick={prevProduct} variant={"outline"} size={"icon"} className="rounded-full" >
                  <ChevronLeft strokeWidth={1.5} color="gray" className=" w-6 h-6" />
                </Button>
              }

              {next &&
                <Button onClick={nextProduct} variant={"outline"} size={"icon"} className="rounded-full" >
                  <ChevronRight strokeWidth={1.5} color="gray" className=" w-6 h-6" />
                </Button>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}