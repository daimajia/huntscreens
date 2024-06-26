import assert from 'assert';
import { Resend } from 'resend';

export async function addAudience(email: string) {
  const resend = new Resend(process.env.RESEND_KEY);
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  assert(audienceId && resend);

  await resend.contacts.create({
    email: email,
    unsubscribed: false,
    audienceId: audienceId!,
  });
}