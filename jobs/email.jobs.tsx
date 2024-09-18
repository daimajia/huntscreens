import { client } from "@/trigger";
import { cronTrigger, eventTrigger } from "@trigger.dev/sdk";
import { db } from "@/db/db";
import { and, desc, eq, gte } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { subHours } from "date-fns";
import DailyDigestEmail from "@/emails/daily.digest";
import { z } from "zod";
import { yc } from "@/db/schema";
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

    await resend.emails.send({
      to: payload.email,
      subject: subject,
      from: `HuntScreens Daily Digest <hello@huntscreens.com>`,
      react: <DailyDigestEmail producthunts={phs} contactId={payload.contactId} yc_count={yc_count.length} />
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
