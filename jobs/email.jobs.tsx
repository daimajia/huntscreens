import { client } from "@/trigger";
import { cronTrigger, eventTrigger } from "@trigger.dev/sdk";
import DailyDigestEmail from "@/emails/daily.digest";
import { Resend } from "resend";
import { Resend as TriggerResend } from "@trigger.dev/resend"; // trigger.resend is out of date.
import { z } from "zod";
import { queryLatestPHTop10 } from "@/lib/emails/query.latest.top10";

const triggerResend = new TriggerResend({
  id: "resend",
  apiKey: process.env.RESEND_KEY!,
});

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
  integrations: {
    triggerResend
  },
  run: async (payload, io, ctx) => {
    const phs = await queryLatestPHTop10();
    if (phs.length < 10) {
      return "no enough phs";
    }
    await io.triggerResend.emails.send(`send-digest-email-${payload.email}`, {
      to: payload.email,
      subject: 'HuntScreens Daily Digest',
      from: `HuntScreens Daily Digest <hello@huntscreens.com>`,
      react: <DailyDigestEmail producthunts={phs} contactId={payload.contactId} yc_count={0} />
    });
    await io.wait("waitting-" + payload.email, 3);
  }
})


client.defineJob({
  id: "schedule daily email",
  name: "schedule daily digest",
  version: "0.0.2",
  trigger: cronTrigger({
    cron: "30 9 * * 1-5"
  }),
  integrations: {
    triggerResend
  },
  run: async (payload, io, cxt) => {
    const resend = new Resend(process.env.RESEND_KEY!);
    const { data: subscribers, error } = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID!
    })

    if (error) {
      throw error;
    }

    subscribers?.data.forEach(async (contact) => {
      if (!contact.unsubscribed) {
        await io.sendEvent("send digest email " + contact.email, {
          name: "send.digest.email",
          payload: {
            email: contact.email,
            contactId: contact.id
          }
        });
      }
    });
  }
});
