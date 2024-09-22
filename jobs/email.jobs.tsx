import { client } from "@/trigger";
import { cronTrigger, eventTrigger } from "@trigger.dev/sdk";
import DailyDigestEmail from "@/emails/daily.digest";
import { z } from "zod";
import { queryLatestPHTop10 } from "@/lib/emails/query.latest.top10";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY!);

export const resendLimiter = client.defineConcurrencyLimit({
  id: `resend-limit`,
  limit: 1,
});


client.defineJob({
  id: "send daily email event",
  name: "send daily email digest event",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "send.digest.email",
    schema: z.object({
      email: z.string().nonempty(),
      contactId: z.string().nonempty()
    })
  }),
  concurrencyLimit: resendLimiter,
  run: async (payload, io, ctx) => {
    const phs = await queryLatestPHTop10();
    if (phs.length < 10) {
      return "no enough phs";
    }
    await resend.emails.send({
      to: payload.email,
      subject: 'HuntScreens Daily Digest',
      from: `HuntScreens Daily Digest <hello@huntscreens.com>`,
      react: <DailyDigestEmail producthunts={phs} contactId={payload.contactId} yc_count={0} />
    });
  }
})


client.defineJob({
  id: "schedule daily email",
  name: "schedule daily digest",
  version: "0.0.2",
  trigger: cronTrigger({
    cron: "30 9 * * 1-5"
  }),
  run: async (payload, io, cxt) => {

    const { data: subscribers, error } = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID!
    });

    if (error) {
      throw error;
    }

    if (subscribers?.data) {
      for (const contact of subscribers.data) {
        if (!contact.unsubscribed) {
          await io.sendEvent("send digest email " + contact.email, {
            name: "send.digest.email",
            payload: {
              email: contact.email,
              contactId: contact.id
            }
          });
        }
      }
    }
  }
});
