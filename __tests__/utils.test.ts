import { removeUrlParams } from "@/lib/utils/url";
import { expect, test } from "vitest";

test('url params remove', () => {
  const url = removeUrlParams("https://theresanaiforthat.com/ai/magical/?ref=search&term=Meeting+scheduling+", ['ref', 'term']);
  expect(url).eq('https://theresanaiforthat.com/ai/magical/');

  const url2 = removeUrlParams("https://www.kapan-ya.com/?ref=producthunt", ['ref']);
  expect(url2).eq('https://www.kapan-ya.com/');
});