import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import SignOut from "./sign-out";


export default async function UserMenu(props: {
  name?: string | null,
  picture?: string | null
}) {
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8">
          <AvatarImage src={props.picture || ""} alt="avatar" />
          <AvatarFallback>{props.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut onSignOut={async () => {
            'use server';
            await signOut(logtoConfig);
          }}></SignOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}