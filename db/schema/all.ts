import { sql } from 'drizzle-orm';
import { pgView, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { SupportedLangs } from '@/i18n/types';
import { TranslationContent } from './types';
import { indiehackers } from './indiehackers';
import { producthunt } from './ph';
import { taaft } from './taaft';
import { yc } from './yc';

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
  translations: jsonb('translations').$type<Partial<Record<SupportedLangs, TranslationContent>>>()
}).as(sql`
  SELECT id, name, tagline, description, website, thumb_url, uuid, 'ph' as item_type, added_at as launch_date, translations
  FROM ${producthunt}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'yc' as item_type, launched_at as launch_date, translations
  FROM ${yc}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'indiehackers' as item_type, added_at as launch_date, translations
  FROM ${indiehackers}
  WHERE webp = true

  UNION ALL

  SELECT id, name, tagline, description, website, thumb_url, uuid, 'taaft' as item_type, added_at as launch_date, translations
  FROM ${taaft}
  WHERE webp = true

  ORDER BY launch_date DESC
`);
