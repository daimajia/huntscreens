/* eslint-disable @next/next/no-img-element */
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import useSWR from "swr";
import { getCookie } from 'cookies-next';
import { ProductDetailData } from "../types/api.types";
import DetailSkeleton from "../skeletons/detail.skeleton";
import { useEffect, useState } from "react";
import { Producthunt } from "@/db/schema/ph";
import GoBack from "./back.button";
import Spiner from "../skeletons/loading.spin";
import { YC } from "@/db/schema";

type ProductType = "ph" | "yc";

type ProductModel<T extends ProductType> = T extends "ph" ? Producthunt : YC;

export default function ProductDetailModal<T extends ProductType>(props: {
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
      requestUrl = `/api/startup/yc/${yc_sort}/${currentPid}`;
      break;
  }

  const { data, isLoading } = useSWR<ProductDetailData<ProductModel<T>>>(`${requestUrl}`, fetcher);

  useEffect(() => {
    if (!product) return;
    let replaceUrl = "";
    switch (props.productType) {
      case "ph":
        replaceUrl = `/p/${product.id}`;
        break;
      case "yc":
        replaceUrl = `/startup/yc/${product.id}`;
    }

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
              <Spiner className="mr-5" />
            }
            {prev &&
              <Button onClick={prevProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronLeft strokeWidth={1.5} color="gray" className=" w-6 h-6" />
              </Button>
            }
            {next &&
              <Button onClick={nextProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronRight strokeWidth={1.5} color="gray" className=" w-6 h-6" />
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

          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-row gap-4 items-center  p-5 mt-10">
              {props.productType === "yc" && (product as YC).thumb_url &&
                <img alt={`${product.name} thumbnail`} loading="lazy" src={(product as YC).thumb_url || ""} className=" w-20 rounded-lg border" />
              }
              {props.productType === "ph" &&
                <img alt={`${product.name} thumbnail`} loading="lazy" src={(product as Producthunt)?.thumbnail?.url} className=" w-20 rounded-lg" />
              }
              <div className="flex flex-col gap-1 ">
                <h1 className=" text-xl font-semibold">{product?.name}</h1>
                <h2 className="  text-slate-600">
                  {product?.tagline}
                </h2>
              </div>
            </div>
          </div>
          <div>
          </div>


          <div className="px-5 h-60 overflow-auto">
            <h2 className="text-slate-500">
              {product?.description}
            </h2>
          </div>

          {props.productType === "ph" &&
            <div className="p-5 gap-2 flex flex-wrap">
              {product && props.productType === "ph" && (product as Producthunt).topics?.nodes.map((item) =>
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