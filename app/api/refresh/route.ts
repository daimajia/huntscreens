import { db } from "@/db/db";
import { producthunt } from "@/db/schema/ph";
import { takeScreenshotJob } from "@/jobs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await db.query.producthunt.findMany({
    where: eq(producthunt.webp, false)
  });

  res.forEach(async (item) => {
    await takeScreenshotJob.invoke({
      url: item.website || "",
      uuid: item.uuid || ""
    })
  })

  return NextResponse.json({
    'updated': 'updated'
  });
}