import { Badge } from "@/components/ui/badge";
import { YC } from "@/db/schema";
import { BriefcaseBusiness, CircleDot, GraduationCapIcon, Map, Rocket, TreePine, Users, Users2, Users2Icon, UsersRound, UsersRoundIcon } from "lucide-react";

export default function YCInfoBadge(props: { yc: YC }) {
  const yc = props.yc;
  const badgeCls = "gap-2"
  const iconCls = "w-5 h-5"
  return <div className="flex flex-row flex-wrap p-5 gap-3">
    <Badge title="Company Founded At" className={badgeCls} variant={"outline"}><Rocket className={iconCls} strokeWidth={1.5} />{yc.launched_at}</Badge>
    <Badge title="Company Status" className={badgeCls} variant={"outline"}><CircleDot className={iconCls} strokeWidth={1.5} />{yc.status}</Badge>
    <Badge title="Stage" className={badgeCls} variant={"outline"}><TreePine className={iconCls} strokeWidth={1.5} />{yc.stage}</Badge>
    <Badge title="YC Batch" className={badgeCls} variant={"outline"}><GraduationCapIcon className={iconCls} strokeWidth={1.5} />{yc.batch}</Badge>
    <Badge title="Team Size" className={badgeCls} variant={"outline"}><UsersRoundIcon className={iconCls} strokeWidth={1.5} />{yc.team_size}</Badge>
    <Badge title="Company Industry" className={badgeCls} variant={"outline"}><BriefcaseBusiness className={iconCls} strokeWidth={1.5} />{yc.industry}</Badge>
    <Badge title="Company Regions" className={badgeCls} variant={"outline"}><Map className={iconCls} strokeWidth={1.5} />{yc.regions}</Badge>
  </div>
}