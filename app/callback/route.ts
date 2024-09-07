import { handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/user';
import { logtoConfig } from '@/lib/auth/logto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);
  await getCurrentUser();
  redirect('/');
}