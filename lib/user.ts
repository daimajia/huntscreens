import { logtoConfig } from "@/lib/auth/logto";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { getLogtoContext } from "@logto/next/server-actions";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const response = await getLogtoContext(logtoConfig);
  if(!response.claims?.email){
    return null;
  }
  let user = await db.query.users.findFirst({
    where: eq(users.email, response.claims.email.toLowerCase())
  })
  if(!user) {
    const ret = await db.insert(users).values({
      email: response.claims.email.toLowerCase(),
      subscribed: false,
      avatar: response.claims.picture,
      email_verified: response.claims.email_verified,
      name: response.claims.name
    }).returning();
    user = ret[0];
  }
  return user;
}