import { db } from "@/db/db";
import { allProducts } from "@/db/schema";
import { sql } from "drizzle-orm";

type TopicCount = {
  topic: string;
  count: number;
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
        .from(allProducts)
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