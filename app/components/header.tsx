/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ModeToggle } from "./theme-button";
import { logtoConfig } from "../logto";
import { getLogtoContext, LogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import UserMenu from "./user.menu";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import getUpdateCounts from "@/lib/api/query.updatecount";

export default async function Header() {
  const updateCns = await getUpdateCounts();
  let response: LogtoContext;
  try {
    response = await getLogtoContext(logtoConfig);
  } catch (e) {
    console.log(e);
    response = {
      isAuthenticated: false,
      userInfo: undefined
    }
  }

  return <>
    <div className="grid grid-cols-2 md:grid-cols-3 justify-between py-4 px-4 md:px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100  bg-background">

      <div className="hidden md:flex flex-row gap-5 items-center text-sm ">

        <div className="flex flex-row justify-center items-center gap-1">
          <Link href="/" className="hover:underline relative flex flex-row gap-1 justify-center items-center">
            <img src="/phlogo.png" alt="" className=" h-10" />
            ProductHunt
          </Link>
          {updateCns.PH > 0 && <span title={`${updateCns.PH} new product today`} className=" bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">+{updateCns.PH}</span>}
        </div>

        <div className="flex flex-row justify-center items-center gap-1">
          <Link href="/indiehackers" className="hover:underline relative flex flex-row gap-1 justify-center items-center">
            <img src="/indiehackers.jpg" alt="" className=" h-7 rounded-full" />
            IndieHackers
          </Link>
          {updateCns.Indiehackers > 0 && <span title={`${updateCns.Indiehackers} new hackers today`} className=" bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">+{updateCns.Indiehackers}</span>}
        </div>

        <div className="flex flex-row items-center justify-center gap-1">
          <Link href="/startup/yc" className="hover:underline relative flex flex-row gap-1 justify-center items-center">
            <img src="/yc.png" alt="" className="h-7 rounded-full" />
            Y Combinator
          </Link>
          {updateCns.YC > 0 && <span title={`${updateCns.YC} new company today`} className=" bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">+{updateCns.YC}</span>}
        </div>
      </div>

      <div className="bg-dark-logo flex justify-center">
        <Link href="/">
          <img alt="logo" loading="lazy" src="/logo.png" className="dark:hidden w-40"></img>
          <img alt="dark logo" loading="lazy" src="/dark-logo.png" className="w-0 dark:w-40"></img>
        </Link>
      </div>

      <div className="md:hidden flex flex-row gap-3 justify-end">
        <Link href="/" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/phlogo.png" alt="" className=" h-8" />
        </Link>
        <Link href="/indiehackers" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/indiehackers.jpg" alt="" className=" h-7 rounded-full" />
        </Link>
        <Link href="/startup/yc" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/yc.png" alt="" className="h-7 rounded-full" />
        </Link>
      </div>

      <div className="hidden md:flex flex-row gap-4 items-center justify-end">
        {response.isAuthenticated &&
          <UserMenu picture={response.claims?.picture} name={response.claims?.name} />}

        {!response.isAuthenticated && <SignIn onSignIn={async () => {
          'use server';
          await signIn(logtoConfig);
        }} />}

        <Link title="Looking forward to your contribution.❤️" href="https://github.com/daimajia/huntscreens" target="__blank">
          <Button size={"icon"} variant={"outline"}>
            <GitHubLogoIcon className="w-4 h-4" />
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </div>
  </>
}