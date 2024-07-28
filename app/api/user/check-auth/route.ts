import { getCurrentUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    isLogin: user !== null
  });
}