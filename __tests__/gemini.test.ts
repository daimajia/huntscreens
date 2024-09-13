import { locales, SupportedLangs } from '@/i18n/types';
import { categorizeProductV3 } from '@/lib/ai/gemini/category.v3';
import { describe, it, expect } from 'vitest';
import { producthunt } from '@/db/schema/ph';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';

describe('Gemini Category V3', () => {
  it('should categorize a product correctly using V3 and determine if it is an AI product', async () => {
    const testProductId = 482592; // 使用实际的数据库 ID

    // 从数据库获取产品数据
    const product = await db.select({
      link: producthunt.website,
      name: producthunt.name,
      tagline: producthunt.tagline,
      description: producthunt.description,
      uuid: producthunt.uuid,
    })
    .from(producthunt)
    .where(eq(producthunt.id, testProductId))
    .limit(1)
    .then(results => results[0]);

    if (!product) {
      throw new Error(`Product with ID ${testProductId} not found`);
    }

    try {
      const result = await categorizeProductV3({
        link: product.link!,
        name: product.name!,
        tagline: product.tagline!,
        description: product.description!,
        screenshot: `https://shot.huntscreens.com/${product.uuid}.webp`,
      });
      console.log('Categorization V3 result:', result);
      
      expect(result).to.be.an('object');
      expect(result).to.have.property('maincategory');
      expect(result).to.have.property('subcategory');
      expect(result).to.have.property('topics');
      expect(result).to.have.property('isAIProduct');
      
      // 验证主分类
      expect(result.maincategory).to.be.an('object');
      expect(result.maincategory).to.have.property('name');
      expect(result.maincategory).to.have.property('slug');
      expect(result.maincategory).to.have.property('translations');

      // 验证子分类
      expect(result.subcategory).to.be.an('object');
      expect(result.subcategory).to.have.property('name');
      expect(result.subcategory).to.have.property('slug');
      expect(result.subcategory).to.have.property('translations');

      // 验证主题
      expect(result.topics).to.be.an('array');
      expect(result.topics.length).to.be.at.least(1);
      expect(result.topics.length).to.be.at.most(3);

      result.topics.forEach((topic) => {
        expect(topic).to.have.property('name');
        expect(topic).to.have.property('slug');
        expect(topic).to.have.property('translations');
      });

      // 验证所有分类和主题的翻译
      const validateTranslations = (category: { translations: Record<SupportedLangs, string> }) => {
        locales.forEach(locale => {
          expect(category.translations).to.have.property(locale);
          expect(category.translations[locale]).to.be.a('string');
        });
      };

      validateTranslations(result.maincategory);
      validateTranslations(result.subcategory);
      result.topics.forEach(validateTranslations);

      expect(result.isAIProduct).to.be.a('boolean');

      console.log('Parsed categories V3:', JSON.stringify(result, null, 2));

    } catch (error) {
      console.error('Test V3 failed:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, { timeout: 600000 });
});
