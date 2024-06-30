import { fetchPHPosts, fetchVoteCount } from '@/lib/producthunt';
import { expect, test } from 'vitest';

test("test producthunt api", async () => {
  const edges = await fetchPHPosts();
  expect(edges).not.toBeNull();
  expect(edges).not.toBeUndefined();
  expect((edges as []).length).toBeGreaterThan(0);
});


test("test fetch post data api", async () => {
  const post = await fetchVoteCount(463347);
  expect(post.votesCount).greaterThan(0);
  expect(post.commentsCount).greaterThan(0);
})