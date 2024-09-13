import { SupportedLangs } from "@/i18n/types";


export type PredefinedCategory = {
  maincategory: {
    [key: string]: string;
  };
  slug: string;
  emoji: string;
}

/**
 * AIProductInfoForCategorization is a type that represents the product information for categorization.
 * It is used to query the AI for product categorization.
 */
export interface AIProductInfoForCategorization {
  link: string;
  name: string;
  tagline: string;  
  description: string;
  screenshot: string;
}

export type CategoryItem = {
  name: string;
  slug: string;
  translations: Record<SupportedLangs, string>;
}

export type TopicItem = CategoryItem;

/**
 * Category is a type that represents the categories of a product.
 * It is used to store the categories of a product in the database.
 */
export type Category = {
  maincategory: CategoryItem;
  subcategory: CategoryItem;
  topics: TopicItem[];
}