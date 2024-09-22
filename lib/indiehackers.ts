import { NewProduct } from "@/db/schema";
import { IndieHackersMetadata } from "@/db/schema/types";
import algoliasearch from "algoliasearch";
import slugify from "slugify"; // Assuming slugify is imported from a library

type RawIndieHackersJSON = {
  _tags: string[];
  approvedTimestamp: number;
  avatarUrl: string;
  bumpedTimestamp: number;
  city: string;
  country: string;
  createdTimestamp: number;
  description: string;
  last30DaysUniques: null | number;
  name: string;
  numFollowers: number;
  productId: string;
  publishedTimestamp: number;
  region: string;
  revenue: number;
  startDateStr: string;
  tagline: string;
  twitterHandle: string;
  updatedTimestamp: number;
  userIds: string[];
  websiteUrl: string;
  objectID: string;
}

function convertToIndieHackerModel(raw: RawIndieHackersJSON): NewProduct {
  console.log(raw);
  return {
    name: raw.name,
    slug: slugify(raw.name, { lower: true, strict: true, trim: true }),
    tagline: raw.tagline,
    description: raw.description,
    website: raw.websiteUrl,
    itemType: "indiehackers",
    thumb_url: raw.avatarUrl,
    added_at: new Date(raw.approvedTimestamp),
    launched_at: new Date(raw.approvedTimestamp),
    webp: false,
    aiintro: null,
    metadata: {
      revenue: raw.revenue || 0,
      followers: raw.numFollowers || 0,
    } as IndieHackersMetadata,
  };
}

export async function getIndiehackersProducts(page=0): Promise<NewProduct[]> {
  const client = algoliasearch("N86T1R3OWZ", "5140dac5e87f47346abbda1a34ee70c3");
  const index = client.initIndex("products");
  const results = await index.search<RawIndieHackersJSON>("", {
    hitsPerPage: 50,
    page: page || 0,
  })
  return results.hits.map((item) => convertToIndieHackerModel(item));
}