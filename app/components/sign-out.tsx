'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
  onSignOut: () => Promise<void>;
};

const SignOut = ({ onSignOut }: Props) => {
  return (
    <DropdownMenuItem
      onClick={() => {
        onSignOut();
      }}
    >
      Log out
    </DropdownMenuItem>
  );
};

export default SignOut;