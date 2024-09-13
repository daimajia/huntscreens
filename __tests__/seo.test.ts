import { describe, it, expect } from "vitest";
import { generateSEOContent, generateSEOFromPath } from "../lib/ai/gemini/seo.generator";

describe('SEO Content Generation', () => {
  
  // it('should generate SEO-friendly content', async () => {
  //   const name = "Remade";
  //   const tagline = "ビジネス向けの生成AI商品写真";
  //   const description = "Remadeは、AIを使用して、スマートフォンからスタジオ品質の商品写真撮影を作成します。 従来の撮影は、労働集約的で遅く、高価です。企業はそれに数千ドルを費やしますが、小規模企業はしばしばそれを買う余裕がありません。Remadeは、プロの画像の費用を100倍に削減し、納期を数週間から15分に短縮します。AIとソーシャルメディアデータを使用して、コンテンツの作成をパーソナライズし、製品広告を最適化します。私たちの使命は、複数の業界にわたって視覚コンテンツの生成を合理化し、ビジネスにとってより速く、よりアクセスしやすくすることです。"

  //   const seoContent = await generateSEOContent(name, tagline, description, "ja");
  //   console.log(seoContent);

  //   // Test the structure of the response
  //   expect(seoContent).toHaveProperty('title');
  //   expect(seoContent).toHaveProperty('description');
  //   expect(seoContent).toHaveProperty('keywords');

  //   // Test the title
  //   expect(typeof seoContent.title).toBe('string');
  //   expect(seoContent.title.length).toBeLessThanOrEqual(60);

  //   // Test the description
  //   expect(typeof seoContent.description).toBe('string');
  //   expect(seoContent.description.length).toBeLessThanOrEqual(160);

  //   // Test the keywords
  //   expect(Array.isArray(seoContent.keywords)).toBe(true);
  //   expect(seoContent.keywords.length).toBeLessThanOrEqual(20);
  //   seoContent.keywords.forEach(keyword => {
  //     expect(typeof keyword).toBe('string');
  //   });

  //   // Log the results for manual inspection
  //   console.log('Generated SEO Content:');
  //   console.log('Title:', seoContent.title);
  //   console.log('Description:', seoContent.description);
  //   console.log('Keywords:', seoContent.keywords);
  // }, 30000); // Increase timeout to 30 seconds as AI requests might take longer

  it('should generate SEO content from URL path segments', async () => {
    const pathSegments = [
      {
        slug_type: "maincategory",
        slug: "health and wellness"
      },
      {
        slug_type: "subcategory",
        slug: "health analysis monitoring"
      }
    ];

    const seoContent = await generateSEOFromPath(pathSegments, "zh");
    console.log(seoContent);

    // Test the structure of the response
    expect(seoContent).toHaveProperty('title');
    expect(seoContent).toHaveProperty('description');
    expect(seoContent).toHaveProperty('keywords');

    // Test the title
    expect(typeof seoContent.title).toBe('string');
    expect(seoContent.title.length).toBeLessThanOrEqual(60);

    // Test the description
    expect(typeof seoContent.description).toBe('string');
    expect(seoContent.description.length).toBeLessThanOrEqual(160);

    // Test the keywords
    expect(Array.isArray(seoContent.keywords)).toBe(true);
    expect(seoContent.keywords.length).toBeLessThanOrEqual(20);
    expect(seoContent.keywords.join(', ').length).toBeLessThanOrEqual(100);
    seoContent.keywords.forEach(keyword => {
      expect(typeof keyword).toBe('string');
    });

    // Log the results for manual inspection
    console.log('Generated SEO Content from Path:');
    console.log('Title:', seoContent.title);
    console.log('Description:', seoContent.description);
    console.log('Keywords:', seoContent.keywords);
  }, 30000); // Increase timeout to 30 seconds as AI requests might take longer
});
