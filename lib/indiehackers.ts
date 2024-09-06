import { IndieHackersJson } from "@/db/schema/indiehackers";
import algoliasearch from "algoliasearch";

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

function convertToIndieHackerModel(raw: RawIndieHackersJSON): IndieHackersJson {
  return {
    name: raw.name,
    tags: raw._tags,
    thumbnail: raw.avatarUrl,
    website: raw.websiteUrl,
    tagline: raw.tagline,
    description: raw.description,
    objectId: raw.objectID,
    revenue: raw.revenue || 0,
    followers: raw.numFollowers || 0,
    twitterHandle: raw.twitterHandle || null,
    userIds: raw.userIds || [],
    startDate: raw.startDateStr,
    region: raw.region || null,
    added_at: new Date(raw.approvedTimestamp),
    itemType: "indiehackers",
    thumb_url: raw.avatarUrl,
    translations: {},
    seo: {}
  }
}

export async function getIndiehackersProducts(page=0): Promise<IndieHackersJson[]> {
  const client = algoliasearch("N86T1R3OWZ", "5140dac5e87f47346abbda1a34ee70c3");
  const index = client.initIndex("products");
  const results = await index.search<RawIndieHackersJSON>("", {
    hitsPerPage: 50,
    page: page || 0,
  })
  return results.hits.map((item) => convertToIndieHackerModel(item));
}