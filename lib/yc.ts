import { NewProduct } from "@/db/schema";
import { YCMetadata } from "@/db/schema/types";
import algoliasearch from "algoliasearch";
import slugify from "slugify";

type RawYCJSON = {
  name: string;
  slug: string;
  former_names: string[];
  small_logo_thumb_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  highlight_black: boolean;
  highlight_latinx: boolean;
  highlight_women: boolean;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  tags_highlighted: string[];
  top_company: boolean;
  isHiring: boolean;
  nonprofit: boolean;
  batch: string;
  status: string;
  industries: string[];
  regions: string[];
  stage: string;
  app_video_public: boolean;
  demo_day_video_public: boolean;
  app_answers: null;
  question_answers: boolean;
  objectID: string;
};

export async function fethcYCLatestCompanies(page=0): Promise<NewProduct[]> {
  const client = algoliasearch("45BWZJ1SGC", "MjBjYjRiMzY0NzdhZWY0NjExY2NhZjYxMGIxYjc2MTAwNWFkNTkwNTc4NjgxYjU0YzFhYTY2ZGQ5OGY5NDMxZnJlc3RyaWN0SW5kaWNlcz0lNUIlMjJZQ0NvbXBhbnlfcHJvZHVjdGlvbiUyMiUyQyUyMllDQ29tcGFueV9CeV9MYXVuY2hfRGF0ZV9wcm9kdWN0aW9uJTIyJTVEJnRhZ0ZpbHRlcnM9JTVCJTIyeWNkY19wdWJsaWMlMjIlNUQmYW5hbHl0aWNzVGFncz0lNUIlMjJ5Y2RjJTIyJTVE");
  const index = client.initIndex("YCCompany_By_Launch_Date_production");
  const results = await index.search<RawYCJSON>("", {
    hitsPerPage: 100,
    page: page,
  })
  return results.hits.map((item) => convertToYCModel(item));
}

export function convertToYCModel(company: RawYCJSON): NewProduct {
  return {
    id: parseInt(company.objectID),
    name: company.name,
    slug: company.slug || slugify(company.name, { lower: true, strict: true, trim: true }),
    tagline: company.one_liner,
    description: company.long_description,
    website: company.website,
    itemType: 'yc',
    thumb_url: company.small_logo_thumb_url,
    added_at: new Date(),
    launched_at: new Date(company.launched_at * 1000),
    webp: false,
    aiintro: null,
    metadata: {
      batch: company.batch,
      team_size: company.team_size || 0,
      launched_at: new Date(company.launched_at * 1000),
      status: company.status,
    } as YCMetadata
  };
}