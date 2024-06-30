import { prettyURL } from "@/lib/utils/url";
import { expect, test } from "vitest";

test('url pretty', () => {
  let url = prettyURL("https://www.kapan-ya.com/?ref=producthunt");
  expect(url).toEqual('https://www.kapan-ya.com/');

  url = prettyURL('https://www.kapan-ya.com/?page=1&ref=producthunt');
  expect(url).toEqual('https://www.kapan-ya.com/?page=1');
});