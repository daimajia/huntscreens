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
      Subscribe for Free
    </Button>
  );
};

export default SignIn;