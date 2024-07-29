"use client";
import { Button } from "@/components/ui/button";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { handleLoginAction } from "./subscribe.action";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MailCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

type SubscribeButtonProps = {
  subscribed: boolean | null | undefined,
  isLogin: boolean
}

export default function SubscribeButton({ subscribed, isLogin }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(subscribed);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubscribeClick = async () => {
    setIsLoading(true);
    try {
      const ret = await fetch('/api/user/subscribe', { method: "put" });
      const data = await ret.json()
      if (!data['error']) {
        setIsSubscribed(true);
        toast({
          title: "Subscribed Successfully",
          description: "You will now receive daily email updates.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      // 这里应该是您的取消订阅 API 调用
      const response = await fetch('/api/user/subscribe', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }
      setIsSubscribed(false);
      toast({
        title: "Unsubscribed Successfully",
        description: "You will no longer receive our updates.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Unsubscribe Failed",
        description: "An error occurred while trying to unsubscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return <>
    {isSubscribed ? <>
      <div className=" text-slate-500 flex flex-row gap-1 items-center justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"}>
              <MailCheck className="mr-2 h-4 w-4" />
              Subscribed to Updates</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Unsubscribe</h4>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to unsubscribe from our updates?
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <PopoverClose asChild>
                  <Button variant="outline">Cancel</Button>
                </PopoverClose>
                <Button onClick={handleUnsubscribe} disabled={isLoading}>
                  {isLoading ? "Unsubscribing..." : "Unsubscribe"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </> : <>
      <form action={!isLogin ? handleLoginAction : () => { }}>
        <Button disabled={isLoading} variant={"default"} onClick={isLogin ? onSubscribeClick : () => { }}>
          <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
          Receive Daily Email
        </Button>
      </form>
    </>}

  </>
}