import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "@logto/next/server-actions";
import { logtoConfig } from "../../logto";
import SignOut from "../auth/sign-out";
import Link from "next/link";
import { BookmarkCheck } from "lucide-react";


export default async function UserMenu(props: {
  name?: string | null,
  picture?: string | null
}) {
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8">
          <AvatarImage src={props.picture || ""} alt="avatar" />
          <AvatarFallback>{props.name || "Hi"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={'/favorites'}>My Favorites
          <BookmarkCheck strokeWidth={1.2} className=" text-gray-400 ml-5"/>
          </Link>
        </DropdownMenuItem>
        
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