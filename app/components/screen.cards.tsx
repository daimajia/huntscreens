import { Producthunt } from "@/db/schema/ph";
import Link from "next/link";

export default function ScreenshotCard(props: { producthunt: Producthunt }) {
  return <>
    <div className="flex flex-col  md:flex-row w-full">
      <div className="w-full md:w-1/3 flex flex-col gap-6 md:p-5">
        <h1 className="md:text-6xl text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none">
          <Link href={props.producthunt.website || ""}>
            {props.producthunt.name}
          </Link>
        </h1>
        <h2 className="md:text-2xl text-base-content text-opacity-60  ">
          {props.producthunt.description}
        </h2>
      </div>
      <div className="mockup-window border bg-base-300 w-full md:w-2/3 h-[90vh] overflow-auto">
        <div className="flex justify-center bg-base-200 ">
          <img src={`https://shot.huntscreens.com/${props.producthunt.uuid}.png` || ""}></img>
        </div>
      </div>
    </div>
  </>
}