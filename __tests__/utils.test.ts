import { unifyUrl } from "@/lib/utils/url";
import { expect, test } from "vitest";

test('unifyUrl removes marketing parameters and normalizes paths', () => {
  const testCases = [
    {
      input: 'http://www.example.com/products?utm_source=newsletter&ref=email&valid_param=keep',
      expected: 'http://www.example.com/products?valid_param=keep'
    },
    {
      input: 'https://example.com?utm_campaign=spring2024&id=123',
      expected: 'https://example.com/?id=123'
    },
    {
      input: 'http://www.example.com/',
      expected: 'http://www.example.com/'
    },
    {
      input: 'https://example.com',
      expected: 'https://example.com/'
    },
    {
      input: 'https://www.test.com/blog/post-1/?utm_medium=social&id=2',
      expected: 'https://www.test.com/blog/post-1?id=2'
    },
    {
      input: 'http://subdomain.example.com/path/to/page/?param1=value1&utm_source=ad&hsa_acc=123',
      expected: 'http://subdomain.example.com/path/to/page?param1=value1'
    },
    {
      input: 'https://shop.com/products/?fbclid=abc123&sort=price',
      expected: 'https://shop.com/products?sort=price'
    }
  ];

  testCases.forEach(({ input, expected }) => {
    expect(unifyUrl(input)).toBe(expected);
  });
});