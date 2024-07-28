import { logtoConfig } from "@/app/logto";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { getLogtoContext } from "@logto/next/server-actions";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const response = await getLogtoContext(logtoConfig);
  if(!response.claims?.email){
    return null;
  }
  const exist = await db.query.users.findFirst({
    where: eq(users.email, response.claims.email.toLowerCase())
  })
  return exist;
}