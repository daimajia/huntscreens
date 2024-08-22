import { fetchTAAFTProductDetails, fetchTAAFTLatest } from "@/lib/theresanaiforthat";
import { expect, test, beforeAll, describe } from "vitest";

describe("TheresAnAIForThat API", () => {
  let latestProducts: any[];
  let productDetails: any[];

  beforeAll(async () => {
    latestProducts = await fetchTAAFTLatest();
    const productUrls = [
      "https://theresanaiforthat.com/ai/usemotion",
      "https://theresanaiforthat.com/ai/videotopage/?fid=1124",
    ];
    productDetails = await Promise.all(productUrls.map(url => fetchTAAFTProductDetails(url)));
  }, 60000);

  test("fetchTAAFTLatest returns non-empty array", () => {
    expect(latestProducts).toBeInstanceOf(Array);
    expect(latestProducts.length).toBeGreaterThan(0);
    expect(latestProducts[0]).toHaveProperty('product_name');
    expect(latestProducts[0]).toHaveProperty('product_link');
    expect(latestProducts[0]).toHaveProperty('taaft_link');
    
    latestProducts.forEach(product => {
      expect(() => new URL(product.product_link)).not.toThrow();
      expect(() => new URL(product.taaft_link)).not.toThrow();
    });
  });

  test("fetchTAAFTProductDetails returns correct product information", () => {
    productDetails.forEach(product => {
      expect(product).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.description.length).toBeGreaterThan(100);
      expect(product.website).toBeDefined();
      expect(product.tagline).toBeDefined();
      expect(product.tagline?.length).toBeGreaterThan(0);
      expect(product.savesCount).toBeGreaterThan(0);
    });

    // Specific product assertions
    const usemotion = productDetails.find(p => p.name === "Usemotion");
    expect(usemotion).toBeDefined();
    expect(usemotion?.website).toBe("https://www.usemotion.com/");
  });

  test("fetchTAAFTProductDetails handles errors", async () => {
    await expect(fetchTAAFTProductDetails("https://theresanaiforthat.com/ai/nonexistent"))
      .rejects.toThrow();
  });
}, {timeout: 1000000});