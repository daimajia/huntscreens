// Create a new migration file (e.g., add_trgm_extension_and_index.ts)

import { db } from '@/db/db';
import { sql } from 'drizzle-orm';

export async function up() {
  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    CREATE INDEX idx_producthunt_search ON producthunt USING GIN (
      (name || ' ' || tagline || ' ' || description) gin_trgm_ops
    );

    CREATE INDEX idx_yc_search ON yc USING GIN (
      (name || ' ' || tagline || ' ' || description) gin_trgm_ops
    );

    CREATE INDEX idx_indiehackers_search ON indiehackers USING GIN (
      (name || ' ' || tagline || ' ' || description) gin_trgm_ops
    );

    CREATE INDEX idx_taaft_search ON taaft USING GIN (
      (name || ' ' || tagline || ' ' || description) gin_trgm_ops
    );
  `);
}

export async function down() {
  await db.execute(sql`
    DROP INDEX IF EXISTS idx_producthunt_search;
    DROP INDEX IF EXISTS idx_yc_search;
    DROP INDEX IF EXISTS idx_indiehackers_search;
    DROP INDEX IF EXISTS idx_taaft_search;
    DROP EXTENSION IF EXISTS pg_trgm;
  `);
}

if (require.main === module) {
  up().then(() => {
    console.log('Extension and indexes created successfully');
  }).catch((error) => {
    console.error('Error creating extension and indexes:', error);
  });
}