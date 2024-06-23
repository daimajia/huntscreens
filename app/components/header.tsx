import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./theme-button";

export default function Header() {
  return <>
    <div className="flex flex-row justify-between py-4 px-4 md:px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100  bg-background">
      <div className="bg-dark-logo">
        <Link href="./">
          <img src="/logo.png" className="dark:hidden w-40"></img>
          <img src="/dark-logo.png" className="w-0 dark:w-40"></img>
        </Link>
      </div>
      <div className="flex flex-row gap-4 items-center justify-center">
        <Button variant="default">Subscribe</Button>
        <ModeToggle />
      </div>
    </div>
  </>
}