import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { visibleProducts } from '@/db/schema';
import assert from 'assert';
import qdrantClient, { collectionName } from "@/db/qdrant/qdrant";

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

export async function getProductEmbedding(uuid: string) {
  const results = await db.select().from(visibleProducts).where(eq(visibleProducts.uuid, uuid)).limit(1);

  if(results.length === 0) {
    return {
      embedding: null,
      product: null,
    };
  }
  const product = results[0];

  const name = product.name;
  const title = product.seo?.en?.title;
  const description = product.seo?.en?.description || product.description;
  const tagline = product.tagline;
  const keywords = product.seo?.en?.keywords || "";
  const website = product.website;

  const embedding = await generateEmbedding(`${name} ${title} ${description} ${tagline} ${keywords} ${website}`);
  return {
    embedding,
    product,
  };
}

export async function saveProductEmbedding(uuid: string) {
  const { embedding, product } = await getProductEmbedding(uuid);
  
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

export async function findSimilarProducts(uuid: string, limit: number = 30, page: number = 1) {

  if(page < 1) {
    page = 1;
  }

  const { embedding, product } = await getProductEmbedding(uuid);
  if(!embedding || !product) {
    console.error(`No embedding found for product ${uuid}`);
    return [];
  }

  const results = await qdrantClient.search(collectionName, {
    vector: embedding,
    limit: limit,
    offset: (page - 1) * limit,
  });

  return results;
}