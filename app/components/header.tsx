import Link from "next/link";
import { ModeToggle } from "./theme-button";
import { logtoConfig } from "../logto";
import { getLogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import UserMenu from "./user.menu";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default async function Header() {
  const { isAuthenticated, userInfo } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
  return <>
    <div className="flex flex-row justify-between py-4 px-4 md:px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100  bg-background">
      <div className="bg-dark-logo">
        <Link href="/">
          <img loading="lazy" src="/logo.png" className="dark:hidden w-40"></img>
          <img loading="lazy" src="/dark-logo.png" className="w-0 dark:w-40"></img>
        </Link>
      </div>
      <div className="flex flex-row gap-4 items-center justify-center">
        {isAuthenticated && userInfo && <>
          <UserMenu picture={userInfo.picture} name={userInfo.name} />
        </>}
        {!isAuthenticated && <SignIn onSignIn={async () => {
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