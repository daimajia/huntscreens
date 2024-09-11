import { sql } from 'drizzle-orm';
import { pgView, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { SupportedLangs } from '@/i18n/types';
import { TranslationContent } from './types';
import { indiehackers } from './indiehackers';
import { producthunt } from './ph';
import { taaft } from './taaft';
import { yc } from './yc';
import { Category } from "@/lib/ai/types";

export const allProducts = pgView('just_launched_products', {
  id: integer('id'),
  name: text('name'),
  tagline: text('tagline'),
  description: text('description'),
  website: text('website'),
  thumb_url: text('thumb_url'),
  uuid: text('uuid'),
  item_type: text('item_type'),
  launch_date: timestamp('launch_date'),
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>(),
  categories: jsonb('categories').$type<Category>(),
  isai: boolean('isai')
}).as(sql`
  SELECT id, name, tagline, description, website, thumb_url, uuid, 'ph' as item_type, added_at as launch_date, translations, categories, isai
  FROM ${producthunt}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'yc' as item_type, launched_at as launch_date, translations, categories, isai
  FROM ${yc}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'indiehackers' as item_type, added_at as launch_date, translations, categories, isai
  FROM ${indiehackers}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'taaft' as item_type, added_at as launch_date, translations, categories, isai
  FROM ${taaft}
  WHERE webp = true

  ORDER BY launch_date DESC
`);
