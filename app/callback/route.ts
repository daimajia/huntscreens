import { getLogtoContext, handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { logtoConfig } from '../logto';
import { addAudience } from '@/lib/resend';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import assert from 'assert';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);
  const response = await getLogtoContext(logtoConfig);
  if(response.claims?.email){
    const exist = await db.query.users.findFirst({
      where: eq(users.email, response.claims.email.toLowerCase())
    })
    if(!exist) {
      const user = await db.insert(users).values({
        email: response.claims.email.toLowerCase(),
        subscribed: true,
        avatar: response.claims.picture,
        email_verified: response.claims.email_verified,
        name: response.claims.name
      }).returning();
      assert(user[0].id > 0, 'user added failed');
    }
    await addAudience(response.claims.email);
  }
  redirect('/');
}