import { Producthunt } from "@/db/schema/ph";
import Link from "next/link";
import UpVote from "./upvote";
export default function MiniScreenshotCard(props: {
  producthunt: Producthunt
}) {
  return <>
    <div className={`flex flex-col gap-5 hover:bg-[#f3f5fc] dark:hover:bg-[#2f323d] p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <img className=" h-[40vh] object-cover object-top w-full rounded-t-lg border-gray-200 dark:border-slate-700/60 border" src={`https://shot.huntscreens.com/${props.producthunt.uuid}.png` || ""}></img>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img className="h-10 rounded-md" src={props.producthunt.thumbnail?.url || ""}></img>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className=" font-bold dark:text-white">
              <Link className="hover:underline" href={props.producthunt.website || ""} target="_blank">{props.producthunt.name}</Link>
            </div>
            <div className=" text-slate-500">
              {props.producthunt.tagline}
            </div>
          </div>
          <div>
            <UpVote voteCount={props.producthunt.votesCount || 0} />
          </div>
        </div>
      </div>
    </div>
  </>
}