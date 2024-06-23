"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
import { useHotkeys } from 'react-hotkeys-hook';
import { twMerge } from "tailwind-merge";

export default function GoBack(props: { className?: string }) {
  const router = useRouter();
  useHotkeys("esc", () => router.back())

  return <>
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => router.back()} className={twMerge(props.className)} size={"icon"} variant={"outline"}>
            <Cross2Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-5">
          <Badge>press esc</Badge>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </>

}