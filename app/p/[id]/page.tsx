import GoBack from "@/app/components/back.button";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { cache } from "react";

const queryProduct = cache(async (id: number) => {
  const product = await db.query.producthunt.findFirst({
    where: eq(producthunt.id, id)
  })
  return product;
});

export default async function ProductDetail({ params }: { params: { id: number } }) {
  const product = await queryProduct(params.id);
  return <>
    <div className="flex flex-row w-full">
      <div className="w-full h-screen flex flex-col p-0 md:p-10">
        <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700  flex justify-start items-center space-x-1.5 px-3">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full h-screen overflow-auto  border-gray-200 dark:border-gray-600 border">
          <img src={`https://shot.huntscreens.com/${product?.uuid}.png`}></img>
        </div>
      </div>
      <div className="md:w-[500px] hidden md:flex flex-col pb-10  border rounded-lg my-10 border-r-0 rounded-r-none shadow-sm">

        <div className="absolute top-10 right-5">
          <GoBack className=" border-t-0 rounded-t-none hover:border-t" />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-row gap-4 items-center  p-5 mt-10">
            <img src={product?.thumbnail?.url} className=" w-20 rounded-lg" />
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


        <div className="px-5">
          <h2 className="text-slate-500">
            {product?.description}
          </h2>
        </div>

        <div className="p-5 flex flex-row gap-5">
          <Link className="w-full h-full" href={product?.website || ""} target="__blank">
            <Button className="w-full h-full" variant={"outline"}>GET IT</Button>
          </Link>
          <Link className="w-full h-full" href={product?.url || ""} target="__blank">
            <Button className="w-full border" variant={"outline"}>VOTE ({product?.votesCount || ""})</Button>
          </Link>
        </div>


        {/* <div className="flex h-full items-end px-5">
          <div className="flex flex-row gap-5">
            <div className="w-full">
              <Button>Download</Button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  </>
}