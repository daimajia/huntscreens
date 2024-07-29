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

export async function unsubscribeAudience(email: string) {
  assert(audienceId && resend);
  try {
    const { data: subscribers, error } = await resend.contacts.list({ audienceId });

    if (error) {
      console.error('Error fetching subscribers:', error);
      throw new Error('Failed to fetch subscribers');
    }

    const subscriber = subscribers?.data?.find(sub => sub.email === email);

    if (!subscriber) {
      console.log(`Email ${email} not found in the audience`);
      return { success: false, message: 'Email not found in the audience' };
    }

    const { data: removedContact, error: removeError } = await resend.contacts.remove({
      audienceId,
      id: subscriber.id,
    });

    if (removeError) {
      console.error('Error removing subscriber:', removeError);
      throw new Error('Failed to remove subscriber');
    }

    return { success: true, message: 'Successfully unsubscribed from the audience' };

  } catch (error) {
    console.error('Unsubscribe operation failed:', error);
    return { success: false, message: 'Unsubscribe operation failed' };
  }
  
}

export async function removeAudience(contactId: string) {
  assert(audienceId && resend);
  return await resend.contacts.update({
    unsubscribed: true,
    id: contactId,
    audienceId: audienceId
  })
}