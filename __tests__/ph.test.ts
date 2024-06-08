import { fetchPHPosts } from '@/libs/producthunt';
import { expect, test } from 'vitest';

test("test producthunt api", async () => {
  const edges = await fetchPHPosts();
  expect(edges).not.toBeNull();
  expect(edges).not.toBeUndefined();
  expect((edges as []).length).toBeGreaterThan(0);
});
