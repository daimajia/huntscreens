import { Producthunt } from "@/db/schema/ph";
import Link from "next/link";

export default function MiniScreenshotCard(props: {
  producthunt: Producthunt
}) {
  return <>
    <div className="flex flex-col gap-5 hover:bg-gray-400/10 p-3 rounded-lg transition hover:cursor-pointer">
      <div>
        <img className=" h-[60vh] object-cover object-top w-full rounded-t-lg border-gray-200 border" src={`https://shot.huntscreens.com/${props.producthunt.uuid}.png` || ""}></img>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img className="h-10 rounded-md" src={props.producthunt.thumbnail?.url || ""}></img>
        <div className="flex flex-col">
            <div className=" font-bold">
              <Link href={props.producthunt.website || ""} target="_blank">{props.producthunt.name}</Link>
            </div>
            <div className=" text-slate-500">
              {props.producthunt.tagline}
            </div>
        </div>
      </div>
    </div>
  </>
}