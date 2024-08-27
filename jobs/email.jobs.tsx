import { client } from "@/trigger";
import { cronTrigger, eventTrigger } from "@trigger.dev/sdk";
import { db } from "@/db/db";
import { and, desc, eq, gte } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { subHours } from "date-fns";
import DailyDigestEmail from "@/emails/daily.digest";
import { Resend } from "resend";
import { Resend as TriggerResend } from "@trigger.dev/resend"; // trigger.resend is out of date.
import { z } from "zod";
import { yc } from "@/db/schema";

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
    const phs = await db.query.producthunt.findMany({
      where: and(
        eq(producthunt.webp, true),
        gte(producthunt.added_at, subHours(new Date(), 24))
      ),
      limit: 10,
      orderBy: [desc(producthunt.votesCount)]
    })
    if (phs.length < 10) {
      return "no enough phs";
    }
    const yc_count = await db.query.yc.findMany({
      where: and(
        gte(yc.launched_at, subHours(new Date(), 24).toISOString())
      )
    })
    let subject = 'HuntScreens Daily Digest';
    if (yc_count.length > 0) {
      subject = '🚀 YC Launched ' + yc_count.length + ' Companies Today!';
    }
    await io.triggerResend.emails.send(`send-digest-email-${payload.email}`, {
      to: payload.email,
      subject: subject,
      from: `HuntScreens Daily Digest <hello@huntscreens.com>`,
      react: <DailyDigestEmail producthunts={phs} contactId={payload.contactId} yc_count={yc_count.length} />
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
