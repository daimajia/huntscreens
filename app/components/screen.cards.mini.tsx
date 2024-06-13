import { Producthunt } from "@/db/schema/ph"

export default function MiniCard(props: {
  producthunt: Producthunt
}) {
  return <>
    <div className="flex flex-col">
        <div className="mockup-window border bg-base-300">
          <div className=" h-[90vh] overflow-auto">
            {/* <img src={props.producthunt. || undefined}></img> */}
          </div>
        </div>

        <div className="">
          b
        </div>
    </div>
  </>
}