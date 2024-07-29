import { handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { logtoConfig } from '../../logto';
import { addAudience } from '@/lib/resend';
import { getCurrentUser } from '@/lib/user';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  await handleSignIn(logtoConfig, new URL(request.nextUrl.toString()));
  const user = await getCurrentUser();
  if(user) {
    await addAudience(user.email);
    await db.update(users).set({subscribed: true}).where(eq(
      users.id, user.id
    ));
  }
  redirect('/');
}