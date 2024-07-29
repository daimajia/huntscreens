// app/sign-in.tsx
'use client';

import { Button } from "@/components/ui/button";

type Props = {
  onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
  return (
    <Button
      variant={"link"}
      onClick={() => {
        onSignIn();
      }}
    >
      Log In
    </Button>
  );
};

export default SignIn;