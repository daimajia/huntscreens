import UpVote from "@/app/components/upvote";
import { Producthunt } from "@/db/schema/ph";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { takeScreenshotJob } from "@/jobs";

export default function ManageScreenshotCard(props: {
  producthunt: Producthunt
}) {

  const handleResubmit = async (data: FormData) => {
    // 'use server';
    // await takeScreenshotJob.invoke({ url: data.get('website')?.toString()!, uuid: data.get('uuid')?.toString()! })
  };

  return <>
    {/* <form action={handleResubmit}> */}
    <div className={`flex flex-col gap-5 hover:bg-muted p-3 rounded-lg transition hover:cursor-pointer`}>
      <div>
        <Link href={`/p/${props.producthunt.id}`}>
          <img loading="lazy" className=" h-[40vh] object-cover object-top w-full rounded-t-lg border-muted border" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${props.producthunt.uuid}.webp` || ""}></img>
        </Link>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <img loading="lazy" className="h-10 rounded-md" src={props.producthunt.thumbnail?.url || ""}></img>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className=" font-bold ">
              <Link className="hover:underline" href={props.producthunt.website || ""} target="_blank">{props.producthunt.name}</Link>
            </div>
            <div className=" text-muted-foreground">
              {props.producthunt.tagline}
            </div>
          </div>
          <div>
            <UpVote voteCount={props.producthunt.votesCount || 0} />
          </div>
        </div>
      </div>
      {/* <div>
          <input name="uuid" value={props.producthunt.uuid!} type="hidden"></input>
          <input name="website" value={props.producthunt.website!} type="hidden"></input>
          <Button type="submit">Resubmit</Button>
        </div> */}
    </div>
    {/* </form> */}
  </>
}