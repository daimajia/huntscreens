import { getIndiehackersProducts } from "@/lib/indiehackers";
import { expect, test } from "vitest";

test("fetch IndieHackers latest products", async () => {
  const products = await getIndiehackersProducts();
  
  expect(Array.isArray(products)).toBe(true);
  
  expect(products.length).toBeGreaterThan(0);
  
  products.forEach(product => {
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('tagline');
    expect(product).toHaveProperty('website');
    
    expect(typeof product.name).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(product.name.length).toBeGreaterThan(0);
    
    expect(product.website).toMatch(/^https?:\/\/.+/);
  });
});
