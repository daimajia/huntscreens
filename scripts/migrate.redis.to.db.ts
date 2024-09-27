import { db } from '@/db/db';
import redis from '@/db/redis';
import { seo } from '@/db/schema';
import { SEOContent } from '@/db/schema/types';
import { SupportedLangs } from '@/i18n/types';
import { sql } from 'drizzle-orm';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10);
const REDIS_PATTERN = process.env.REDIS_PATTERN || 'seo:v1.0:*';

async function migrateSEOFromRedisToDb() {
  console.info('Starting migration of SEO data from Redis to database...');

  let cursor = '0';
  let totalMigrated = 0;
  let totalFailed = 0;

  do {
    const [newCursor, keys] = await redis.scan(cursor, 'MATCH', REDIS_PATTERN, 'COUNT', BATCH_SIZE);
    cursor = newCursor;

    const batch = await Promise.all(keys.map(async (key) => {
      const value = await redis.get(key);
      if (!value) return null;

      const seoContent: SEOContent = JSON.parse(value);
      const keyParts = key.split(':');
      if (keyParts.length !== 5) return null;

      const type = keyParts[3] === "topics" ? "topic" : "category";
      const language = keyParts[2] as SupportedLangs;
      const slug = type === 'category' ? `${keyParts[3]}/${keyParts[4]}` : keyParts[4];

      return {
        item: {
          type: type as 'topic' | 'category',
          slug,
          language: language as SupportedLangs,
          title: seoContent.title,
          description: seoContent.description,
          keywords: seoContent.keywords,
        },
        redisKey: key
      };
    }));

    const validBatch = batch.filter((item): item is NonNullable<typeof item> => item !== null);

    if (validBatch.length > 0) {
      try {
        const items = validBatch.map(item => item.item);
        await db.transaction(async (tx) => {
          await tx.insert(seo).values(items);

          await Promise.all(validBatch.map(item => redis.del(item.redisKey)));
        });

        totalMigrated += validBatch.length;
        console.info(`Migrated ${validBatch.length} items. Total: ${totalMigrated}`);
      } catch (error) {
        totalFailed += validBatch.length;
        console.error('Error during batch migration:', error);
      }
    }
  } while (cursor !== '0');

  console.info(`Migration completed. Total migrated: ${totalMigrated}, Total failed: ${totalFailed}`);
}

if (require.main === module) {
  migrateSEOFromRedisToDb().then(() => {
    redis.quit();
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    redis.quit();
    process.exit(1);
  });
}