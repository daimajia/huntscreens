'use server';
import { signIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth/logto";

export const handleLoginAction = async () => {
  
  await signIn(logtoConfig, `${logtoConfig.baseUrl}/callback/subscribe`);
}