
export default function UpVote(props: {
  voteCount: number
}) {
  return <>
    <div className="flex flex-col items-center justify-center border border-gray-500/0 px-2 rounded hover:border-gray-500/30">
      <div className=" text-[#f76154]">
        ▲
      </div>
      <div className="text-sm text-slate-500">
        {props.voteCount}
      </div>
    </div>
  </>
}