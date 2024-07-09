import { eq } from "drizzle-orm";
import { db } from "../db";
import yc from './data/yc_essential_data.json';
import { yc as ycdb } from "@/db/schema/yc";

type YCRawData = {
  id: number
  name: string
  slug: string
  former_names: any[]
  small_logo_thumb_url: string
  website: string
  all_locations: string
  long_description: string
  one_liner: string
  team_size: number
  highlight_black: boolean
  highlight_latinx: boolean
  highlight_women: boolean
  industry: string
  subindustry: string
  launched_at: number
  tags: string[]
  tags_highlighted: any[]
  top_company: boolean
  isHiring: boolean
  nonprofit: boolean
  batch: string
  status: string
  industries: string[]
  regions: string[]
  stage: string
  app_video_public: boolean
  demo_day_video_public: boolean
  app_answers: any
  question_answers: boolean
  objectID: string
}

async function run() {
  const data = yc as YCRawData[];
  const clearedData: { name: string; slug: string; tagline: string; thumb_url: string; website: string; batch: string; all_locations: string; description: string; team_size: number; industry: string; subindustry: string; launched_at: string; tags: string[]; top_company: boolean; is_hiring: boolean; nonprofit: boolean; status: string; industries: string[]; regions: string[]; stage: string; objectID: string; }[] = [];
  data.forEach((company) => {
    const comp = {
      name: company.name,
      slug: company.slug,
      tagline: company.one_liner,
      thumb_url: company.small_logo_thumb_url.includes("missing.png") ? "" : company.small_logo_thumb_url,
      website: company.website,
      batch: company.batch,
      all_locations: company.all_locations,
      description: company.long_description,
      team_size: company.team_size,
      industry: company.industry,
      subindustry: company.subindustry,
      launched_at: new Date(company.launched_at * 1000).toUTCString(),
      tags: company.tags,
      top_company: company.top_company,
      is_hiring: company.isHiring,
      nonprofit: company.nonprofit,
      status: company.status,
      industries: company.industries,
      regions: company.regions,
      stage: company.stage,
      objectID: company.objectID
    }
    clearedData.push(comp);
  });

  clearedData.forEach(async (item) => {
    const exist = (await db.select().from(ycdb).where(eq(ycdb.name, item.name)));
    if(exist.length === 0){
      console.log('insert', item.name);
      await db.insert(ycdb).values(item);
    }else{
      console.log(item.name, 'exist');
    }
  });
  console.log('done');
}

// run();