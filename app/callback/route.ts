import { getLogtoContext, handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { logtoConfig } from '../logto';
import { addAudience } from '@/lib/resend';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);
  const response = await getLogtoContext(logtoConfig);
  if(response.claims?.email){
    await addAudience(response.claims.email);
  }
  redirect('/');
}