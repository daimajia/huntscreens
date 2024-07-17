import { fetchTAAFTProductDetails, fetchTAAFTLatest } from "@/lib/theresanaiforthat";
import { expect, test } from "vitest";

test("test theresanaiforthat fetch latest works", async ()=> {
  const products = await fetchTAAFTLatest();
  expect(products).length.greaterThan(0);
});

test('test theresanaiforthat fetch detail works', async () => {
  const product = await fetchTAAFTProductDetails("https://theresanaiforthat.com/ai/usemotion");
  expect(product.name).eq("Usemotion");
  expect(product.description).length.greaterThan(100);
  expect(product.website).eq("https://www.usemotion.com/");
  expect(product.tagline?.length).gt(0);
  expect(product.savesCount).greaterThan(0);
  expect(product.tags.length).eq(6);
  const alltagNotNull = product.tags.every(item => item && item.length > 0);
  expect(alltagNotNull);
  expect(product.cons.length).gt(0);
  expect(product.pros.length).gt(0);
  console.log(product);
})