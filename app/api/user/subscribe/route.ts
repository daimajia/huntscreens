import { db } from "@/db/db";
import { users } from "@/db/schema";
import { addAudience, unsubscribeAudience } from "@/lib/resend";
import { getCurrentUser } from "@/lib/user";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT() {
  const user = await getCurrentUser();
  if(user) {
    await addAudience(user.email);
    await db.update(users).set({subscribed: true}).where(eq(users.id, user.id));
    return NextResponse.json({error: false, message: "Subscribed Successfully!"});
  }else{
    return NextResponse.json({error: true, message: "Unauthorized"}, {status: 401});
  }
}

export async function DELETE() {
  const user = await getCurrentUser();
  if(user) {
    await unsubscribeAudience(user.email);
    await db.update(users).set({subscribed: false}).where(eq(users.id, user.id));
    return NextResponse.json({error: false, message: "Unsubscribed Successfully!"});
  }else{
    return NextResponse.json({error: true, message: "Unauthorized"}, {status: 401});
  }
}