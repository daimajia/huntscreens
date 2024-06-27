import { Button } from "@/components/ui/button";
import { logtoConfig } from "../logto";
import { CheckCircledIcon, CheckIcon, EnvelopeOpenIcon, FaceIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { getLogtoContext, signIn } from "@logto/next/server-actions";
import { Badge } from "@/components/ui/badge";

export default async function SubscribeButton() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  const handleLoginAction = async () => {
    'use server';
    await signIn(logtoConfig);
  }

  return <>
    {isAuthenticated ? <>
      <div className=" text-slate-500 flex flex-row gap-1 items-center justify-center">
        <Badge variant="outline" className=" border-green-500 text-green-700">
          subscribed
        </Badge>
      </div>
    </> : <>
      <form action={handleLoginAction} className="hidden md:flex">
        <Button variant={"default"}>
          <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
          Receive Daily Email
        </Button>
      </form>
    </>}

  </>
}