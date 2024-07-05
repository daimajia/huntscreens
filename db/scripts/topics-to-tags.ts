import { eq } from "drizzle-orm";
import { db } from "../db";
import { producthunt } from "../schema/ph";

// this script is for updating producthunt.topics(json) to producthunt.tags(array).
// if your deployment time is before 2024/07/06, you need to run the following function manually.

async function run() {
  const phs = await db.query.producthunt.findMany();
  phs.forEach(async (ph) => {
    const topics = ph.topics;
    const tags = topics?.nodes.flatMap((topic) => topic.name)
    await db.update(producthunt).set({tags: tags}).where(eq(producthunt.id, ph.id));
  })
  console.log('done');
}

// run();