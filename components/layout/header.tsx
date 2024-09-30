/* eslint-disable @next/next/no-img-element */
import { ModeToggle } from "@/components/theme/theme-button";
import { getLogtoContext, LogtoContext, signIn } from "@logto/next/server-actions";
import SignIn from "@/components/auth/sign-in";
import UserMenu from "@/components/ui-custom/user.menu";
import SearchBox from "@/components/search/search.box";
import { logtoConfig } from "@/lib/auth/logto";
import LanguageDropdown from "../ui-custom/language.dropdown";
import { Link } from "@/i18n/routing";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import CategorySheet from "./category.sheet";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type HeaderProps = {
  className?: string;
}

export default async function Header({ className }: HeaderProps) {
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

  const t = await getTranslations("Home");

  return <>
    <div className={cn(`h-[70px] px-4 grid grid-cols-2 justify-between items-center  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100  bg-background`, className)}>

      <div className="flex flex-row gap-4 items-center">
        <div className="bg-dark-logo flex pb-1">
          <Link href={`/`}>
            <img alt="logo" loading="lazy" src="/logo.png" className="dark:hidden w-40"></img>
            <img alt="dark logo" loading="lazy" src="/dark-logo.png" className="w-0 dark:w-40"></img>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/category/just-launched" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                🔖 {t("categories")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="lg:hidden flex flex-row gap-3 justify-end">
        <CategorySheet />
      </div>

      <div className="hidden md:flex flex-row gap-4 items-center justify-end">
        <SearchBox />
        {response.isAuthenticated &&
          <UserMenu picture={response.claims?.picture} name={response.claims?.name} />}

        {!response.isAuthenticated && <SignIn onSignIn={async () => {
          'use server';
          await signIn(logtoConfig);
        }} />}

        <ModeToggle />
        <LanguageDropdown />
      </div>
    </div>
  </>
}