'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

type Props = {
  onSignOut: () => Promise<void>;
};

const SignOut = ({ onSignOut }: Props) => {
  const t = useTranslations("Home");
  return (
    <DropdownMenuItem
      onClick={() => {
        onSignOut();
      }}
    >
      {t("signout")}
    </DropdownMenuItem>
  );
};

export default SignOut;