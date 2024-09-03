/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ModeToggle } from "../theme/theme-button";
import { logtoConfig } from "../../logto";
import { getLogtoContext, LogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "../auth/sign-in";
import UserMenu from "../ui/user.menu";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import getUpdateCounts from "@/lib/api/query.updatecount";
import SearchBox from "../search/search.box";

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
    <div className="grid grid-cols-2 justify-between py-4 px-4 md:px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100  bg-background">

      <div className="bg-dark-logo flex">
        <Link href="/">
          <img alt="logo" loading="lazy" src="/logo.png" className="dark:hidden w-40"></img>
          <img alt="dark logo" loading="lazy" src="/dark-logo.png" className="w-0 dark:w-40"></img>
        </Link>
      </div>

      <div className="lg:hidden flex flex-row gap-3 justify-end">
        <Link href="/" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/phlogo.png" alt="ProductHunt logo" className=" h-8" />
        </Link>
        <Link href="/indiehackers" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/indiehackers.jpg" alt="IndieHackers logo" className=" h-7 rounded-full" />
        </Link>
        <Link href="/startup/yc" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/yc.png" alt="YC logo" className="h-7 rounded-full" />
        </Link>
        <Link href="/taaft" className="hover:underline flex flex-row gap-1 justify-center items-center">
          <img src="/taaft.png" alt="TAAFT logo" className="h-7 rounded-full" />
        </Link>
      </div>

      <div className="hidden md:flex flex-row gap-4 items-center justify-end">
        <SearchBox />
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