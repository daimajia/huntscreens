import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const sourceRedis = new Redis(process.env.REDIS!);
const targetRedis = new Redis(process.env.TARGET_REDIS!);

/**
 * Migrate data from source Redis to target Redis
 */
async function migrateData() {
  console.log('Checking source Redis connection and data:');
  let keyCount = await sourceRedis.dbsize();
  try {
    await sourceRedis.ping();
    console.log('Source Redis connection is active');

    await targetRedis.ping();
    console.log('Target Redis connection is active');

    keyCount = await sourceRedis.dbsize();
    console.log(`Total number of keys in source Redis: ${keyCount}`);

    if (keyCount === 0) {
      console.log('No keys found in source Redis. Exiting.');
      return;
    }

    const randomKey = await sourceRedis.randomkey();
    console.log(`Random key found: ${randomKey}`);

  } catch (error) {
    console.error('Error connecting to source Redis or retrieving data:', error);
    return;
  }


  let cursor = '0';
  let pipeline = targetRedis.pipeline();
  let pipelineCount = 0;
  const PIPELINE_SIZE = 200;

  do {
    const [newCursor, keys] = await sourceRedis.scan(cursor, 'MATCH', '*', 'COUNT', '100');
    cursor = newCursor;
    console.log(`Processing ${keys.length} keys, cursor: ${cursor}`);
    for (const key of keys) {
      try {
        const type = await sourceRedis.type(key);

        switch (type) {
          case 'string':
            const value = await sourceRedis.get(key);
            if (value !== null) {
              pipeline.set(key, value);
            }
            break;
          case 'list':
            const listValues = await sourceRedis.lrange(key, 0, -1);
            if (listValues.length > 0) {
              pipeline.rpush(key, ...listValues);
            }
            break;
          case 'set':
            const setMembers = await sourceRedis.smembers(key);
            if (setMembers.length > 0) {
              pipeline.sadd(key, ...setMembers);
            }
            break;
          case 'zset':
            const zsetMembers = await sourceRedis.zrange(key, 0, -1, 'WITHSCORES');
            if (zsetMembers.length > 0) {
              pipeline.zadd(key, ...zsetMembers);
            }
            break;
          case 'hash':
            const hashData = await sourceRedis.hgetall(key);
            if (Object.keys(hashData).length > 0) {
              pipeline.hmset(key, hashData);
            }
            break;
        }

        const ttl = await sourceRedis.ttl(key);
        if (ttl > 0 && !key.startsWith('seo')) {
          pipeline.expire(key, ttl);
        }

        pipelineCount++;

        if (pipelineCount >= PIPELINE_SIZE) {
          await pipeline.exec();
          console.log(`Executed pipeline of ${PIPELINE_SIZE} commands, remaining keys: ${keyCount - pipelineCount}`);
          pipeline = targetRedis.pipeline(); // Create a new pipeline
          pipelineCount = 0;
        }
      } catch (error) {
        console.error(`Error processing key ${key}:`, error);
      }
    }

    console.log(`Processed ${keys.length} keys. Cursor: ${cursor}`);
  } while (cursor !== '0');

  if (pipelineCount > 0) {
    await pipeline.exec();
  }

  console.log('Migration completed');
}

if(require.main === module) { 
  if(!process.env.REDIS || !process.env.TARGET_REDIS) {
    console.error('REDIS or TARGET_REDIS is not set');
    process.exit(1);
  }
  console.log('Starting migration');
  migrateData().then(() => {
    sourceRedis.quit();
    targetRedis.quit();
  }).catch((error) => {
    console.error('Migration failed:', error);
    sourceRedis.quit();
    targetRedis.quit();
  });
}