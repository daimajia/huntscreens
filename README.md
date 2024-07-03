# [HuntScreens.com](https://huntscreens.com?ref=github)

The best way to explore the ProductHunt. Capture every new featured product!

[![](https://shot.huntscreens.com/huntscreens.com.png)](https://huntscreens.com?ref=github)

#### Background story

One day, I felt that browsing ProductHunt wasn't very intuitive, so I quickly made a small project using NextJs. It takes screenshots of each new project on ProductHunt, so now I can quickly browse through them every day and easily see if there's anything interesting to me without having to read a lot of text and click around.

## Getting Started

### Tech stacks

- [Next.js](https://nextjs.org/docs) 
- [Shadcn](https://ui.shadcn.com/)  UI framework based on Tailwind.

- [Supabase](https://supabase.com/) Managed postgres databse.
- [Drizzle](https://orm.drizzle.team/docs/overview) Database ORM.
- [Logto.io](https://logto.io/) Fully open sourced Auth solution.
- [Triggerdev v2.0](https://trigger.dev/docs/documentation/introduction) Background jobs.
- [Resend](https://resend.com/) Email service.
- [ScreenshotOne](https://screenshotone.com/) Screenshot Api.
- [Cloudflare R2](https://developers.cloudflare.com/r2/) Image storage.
- [Umami](https://umami.is/) Website Analytics
- [Koyeb](https://www.koyeb.com/) Paas Service. 

Before deployment, make sure you know all the services or tools above clearly. It may take some time.

### Env Variables

```sh
# setup trigger api key and endpoint url.
# https://trigger.dev/

TRIGGER_API_KEY=
TRIGGER_API_URL=
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY=

# setup Producthunt API access token
# https://api.producthunt.com/v2/docs

PH_ACCESS_TOKEN=

# setup postgres database url.
# https://supabase.com

DATABASE_URL=

# setup screenshot one api.
# !remember to setup s3 extension on ScreenshotOne.
# https://screenshotone.com/

SCREENSHOTONE_ACCESS_KEY=
SCREENSHOTONE_SIGNED_KEY=

# setup resend email service api
# https://resend.com

RESEND_KEY=
RESEND_AUDIENCE_ID=


# cloudflare r2 endpoint url.

NEXT_PUBLIC_CLOUDFLARE_R2=

# setup Logto user authentication
# https://logto.io

LOGTO_APPID=
LOGTO_APP_SECRET=
LOGTO_BASE_URL=
LOGTO_COOKIE_SECRET=
LOGTO_ENDPOINT=
```

After Env vars, generate and migrate the database table:

```
pnpm db:generate
pnpm db:migrate
```

after that, run the dev server.

```bash
pnpm i
pnpm run dev
```

open another terminal, run the trigger service.

```
pnpm triggerdev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Next
* [ ] YC companies

Submit issues or [leave a comment on my twitter](https://twitter.com/daimajia/status/1808315790720180516) if you have any idea!

