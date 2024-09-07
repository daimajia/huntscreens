import { handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { addAudience } from '@/lib/resend';
import { getCurrentUser } from '@/lib/user';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logtoConfig } from '@/lib/auth/logto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, new URL(`${logtoConfig.baseUrl}/callback/subscribe?${searchParams}`));
  const user = await getCurrentUser();
  if(user) {
    await addAudience(user.email);
    await db.update(users).set({subscribed: true}).where(eq(
      users.id, user.id
    ));
  }
  redirect('/');
}