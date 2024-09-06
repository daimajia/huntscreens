// app/sign-in.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
  const t = useTranslations("Home");
  return (
    <Button
      variant={"link"}
      onClick={() => {
        onSignIn();
      }}
    >
      {t("login")}
    </Button>
  );
};

export default SignIn;