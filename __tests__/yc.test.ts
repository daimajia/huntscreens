import { YCMetadata } from "@/db/schema/types";
import { fethcYCLatestCompanies } from "@/lib/yc";
import { expect, test } from "vitest";

test("fetch YC latest portfolio", async () => {
  const r = await fethcYCLatestCompanies();
  expect(r.length).greaterThan(0);
  
  // Check the structure of the first item
  const firstItem = r[0];
  expect(firstItem).toHaveProperty('id');
  expect(firstItem).toHaveProperty('name');
  expect(firstItem).toHaveProperty('slug');
  expect(firstItem).toHaveProperty('tagline');
  expect(firstItem).toHaveProperty('description');
  expect(firstItem).toHaveProperty('website');
  expect(firstItem).toHaveProperty('itemType', 'yc');
  expect(firstItem).toHaveProperty('thumb_url');
  expect(firstItem).toHaveProperty('added_at');
  expect(firstItem).toHaveProperty('launched_at');
  expect(firstItem).toHaveProperty('webp', false);
  expect(firstItem).toHaveProperty('aiintro');
  expect(firstItem).toHaveProperty('metadata');

  // Check metadata structure
  const metadata = firstItem.metadata as YCMetadata;
  expect(metadata).toHaveProperty('batch');
  expect(metadata).toHaveProperty('team_size');
  expect(metadata).toHaveProperty('launched_at');
  expect(metadata).toHaveProperty('status');

  // Optional: Check data types of some properties
  expect(typeof firstItem.id).toBe('number');
  expect(typeof firstItem.name).toBe('string');
  expect(typeof firstItem.website).toBe('string');
  expect(firstItem.added_at).toBeInstanceOf(Date);
  expect(firstItem.launched_at).toBeInstanceOf(Date);
});