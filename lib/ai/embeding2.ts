import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { Product, visibleProducts } from '@/db/schema';
import assert from 'assert';
import qdrantClient, { collectionName } from "@/db/qdrant/qdrant";
import redis from "@/db/redis";

export async function generateEmbedding(text: string): Promise<number[]> {
  assert(process.env.EMBEDDING_URL, "EMBEDDING_URL is not set");

  const response = await fetch(process.env.EMBEDDING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texts: [text] }),
  });
  const data = await response.json();
  return data.embeddings[0];
}

async function getEmbeddingByProduct(product: Product) {
  const items = await qdrantClient.retrieve(collectionName, {
    ids: [product.uuid],
    with_vector: true,
  });

  if(items.length > 0) {
    return items[0].vector as number[];
  }

  const name = product.name;
  const title = product.seo?.en?.title;
  const description = product.seo?.en?.description || product.description;
  const tagline = product.tagline;
  const keywords = product.seo?.en?.keywords || "";
  const website = product.website;
  const embedding = await generateEmbedding(`${name} ${title} ${description} ${tagline} ${keywords} ${website}`);
  return embedding;
}

async function getEmbeddingByUUID(uuid: string) {
  const results = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, uuid)).limit(1);

  if(results.length === 0) {
    return {
      embedding: null,
      product: null,
    };
  }
  const product = results[0];
  const embedding = await getEmbeddingByProduct(product);

  return {
    embedding,
    product,
  };
}

export async function saveEmbeddingByUUID(uuid: string) {
  const { embedding, product } = await getEmbeddingByUUID(uuid);
  
  if(!embedding || !product) {
    console.error(`No embedding found for product ${uuid}`);
    return;
  }

  return await qdrantClient.upsert(collectionName, {
    points: [
      {
        id: uuid,
        vector: embedding,
        payload: {
          ...product,
        }
      }
    ]
  });
}

export async function findSimilarProductsByText(query: string, limit: number = 10, page: number = 1) {
  const embedding = await generateEmbedding(query);

  const results = await qdrantClient.search(collectionName, {
    vector: embedding,
    limit: limit,
    offset: (page - 1) * limit,
  });
  return results;
}

export async function findSimilarProductsByProduct(product: Product, limit: number = 15, page: number = 1): Promise<Product[]> {

  const cache = await redis.get(`altertvies:v2:${product.uuid}`);

  if(cache) {
    return JSON.parse(cache) as Product[];
  }

  if(page < 1) {
    page = 1;
  }

  const embedding = await getEmbeddingByProduct(product);

  if(!embedding) {
    console.error(`No embedding found for product ${product.uuid}`);
    return [];
  }

  const results = await qdrantClient.search(collectionName, {
    vector: embedding,
    filter: {
      must_not: [
        {
          key: "uuid",
          match: {value: product.uuid}
        }
      ]
    },
    limit: limit,
    offset: (page - 1) * limit,
    score_threshold: 0.55,
  });

  const products = results.map((result) => result.payload as Product);
  await redis.setex(`altertvies:v2:${product.uuid}`, 60 * 60 * 24 * 7, JSON.stringify(products));

  return products;
}