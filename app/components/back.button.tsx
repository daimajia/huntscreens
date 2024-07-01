"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { twMerge } from "tailwind-merge";

export type ButtonAction = "home" | "back";

export default function GoBack(props: { className?: string, buttonAction?: ButtonAction }) {
  const router = useRouter();
  const ba = props.buttonAction || "back";

  const onBackClick = () => {
    if (ba === "back") {
      router.back();
    } else if (ba === "home") {
      router.push('/');
    }
  };

  useHotkeys('esc', onBackClick);

  return <>
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={onBackClick} className={twMerge(props.className)} size={"icon"} variant={"outline"}>
            <Cross2Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-5">
          <Badge>[ESC]</Badge>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </>

}