import { client } from "@/trigger";
import { cronTrigger } from "@trigger.dev/sdk";
import { db } from "@/db/db";
import { and, desc, eq, gte } from "drizzle-orm";
import { producthunt } from "@/db/schema/ph";
import { subHours } from "date-fns";
import DailyDigestEmail from "@/emails/daily.digest";
import { Resend } from "resend";
import { Resend as TriggerResend } from "@trigger.dev/resend"; // trigger.resend is out of date.


const triggerResend = new TriggerResend({
  id: "resend",
  apiKey: process.env.RESEND_KEY!,
});

client.defineJob({
  id: "schedule daily email",
  name: "schedule daily digest",
  version: "0.0.1",
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


    subscribers?.data.forEach(async (contact) => {
      if (!contact.unsubscribed) {
        await io.triggerResend.emails.send(`send-digest-email-${contact.email}`, {
          to: contact.email,
          subject: 'HuntScreens',
          from: `HuntScreens Daily Digest <hello@huntscreens.com>`,
          react: <DailyDigestEmail producthunts={phs} contactId={contact.id} />
        });
      }
    });
  }
});
