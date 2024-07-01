import { LoaderCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Spiner(props: {
  className?: string,
}) {
  return <>
    <LoaderCircle color="gray" className={twMerge(' animate-spin w-5 h-5', props.className)} />
  </>
}