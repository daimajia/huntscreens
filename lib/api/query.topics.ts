import { db } from "@/db/db";
import { products, visibleProducts } from "@/db/schema";
import { sql } from "drizzle-orm";

type TopicCount = {
  topic: string;
  count: number;
}

export async function queryTopicTranslation(topicSlug: string){
  const matches = await db.select().from(visibleProducts).where(sql`categories->'topics' @> ${`[{"slug": "${topicSlug}"}]`}`).limit(1);
  const topic = matches.length > 0 ? matches[0].categories?.topics.find((t: any) => t.slug === topicSlug) : undefined;
  return topic;
}

export async function queryTopicsItemCount(topics: string[]): Promise<{ error?: string, results?: TopicCount[] }> {
  if (!Array.isArray(topics) || topics.length === 0 || topics.length > 3) {
    return { error: "Invalid input. Provide 1 to 3 topics." };
  }

  // Validate each topic
  const validTopics = topics.filter(topic => 
    typeof topic === 'string' && 
    topic.trim().length > 0 &&
    topic.length <= 50 && // Assuming a reasonable max length
    /^[a-zA-Z0-9-]+$/.test(topic) // Only allow alphanumeric characters and hyphens
  );

  if (validTopics.length !== topics.length) {
    return { error: "Invalid topic format." };
  }

  const results = await Promise.all(
    validTopics.map(async (topic) => {
      const result = await db
        .select({ count: sql`count(*)` })
        .from(products)
        .where(sql`categories->'topics' @> ${`[{"slug": "${topic}"}]`}`)
        .execute();
  
      return {
        topic,
        count: Number(result[0].count)
      };
    })
  );

  return { results };
}