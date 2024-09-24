import { Product } from "@/db/schema";
import { findSimilarProductsByText } from "../ai/embeding2";

export async function search(query: string, page: number = 1, pageSize: number = 30): Promise<{ results: Product[], totalCount: number }> {
  const results = await findSimilarProductsByText(query, pageSize, page);
  return {
    results: results.map(result => result.payload as Product),
    totalCount: Number(200)
  };
}