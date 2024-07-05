import assert from 'assert';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);
const audienceId = process.env.RESEND_AUDIENCE_ID;

export async function addAudience(email: string) {
  assert(audienceId && resend);
  return await resend.contacts.create({
    email: email,
    unsubscribed: false,
    audienceId: audienceId!,
  });
}

export async function removeAudience(contactId: string) {
  assert(audienceId && resend);
  return await resend.contacts.update({
    unsubscribed: true,
    id: contactId,
    audienceId: audienceId
  })
}