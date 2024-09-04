import { logtoConfig } from "@/lib/auth/logto";
import { signIn } from "@logto/next/server-actions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return await signIn(logtoConfig);
}