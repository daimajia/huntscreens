import { IndieHackers, Producthunt, Taaft, YC } from "@/db/schema";
import { differenceInHours } from "date-fns";
import { MiniCardMetadata } from "../components/screenshot.card";

export type ProductTypes = "ph" | "yc" | "taaft" | "indiehackers";


export type JustLaunchedProduct = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  website: string;
  thumb_url: string;
  uuid: string;
  item_type: 'ph' | 'yc' | 'indiehackers' | 'taaft';
  launch_date: string;
};

export type ApiReturnDataType<T extends ProductTypes> =
  T extends "ph" ? Producthunt :
  T extends "yc" ? YC :
  T extends "indiehackers" ? IndieHackers :
  T extends "taaft" ? Taaft :
  never;

export const urlMapper: Record<ProductTypes, (id: string | number) => string> = {
  "ph" : (id) => `/p/${id}`,
  "yc" : (id) => `/startup/yc/${id}`,
  "indiehackers": (id) => `/indiehackers/${id}`,
  "taaft" : (id) => `/taaft/${id}`
}

export type ProductModel<T extends ProductTypes> = ApiReturnDataType<T>;


export function thumbailGetter<T extends ProductTypes>(productType: T, product: ApiReturnDataType<T>) {
  let thumbnail: string | undefined | null;
  switch (productType) {
    case "ph":
      thumbnail = (product as Producthunt).thumbnail?.url;
      break;
    case "indiehackers":
      thumbnail = (product as IndieHackers).thumbnail;
      break;
    case "taaft":
      thumbnail = (product as Taaft).thumb_url;
      break;
    case "yc":
      thumbnail = (product as YC).thumb_url;
      break
    default:
      throw new Error("remember to set thumbail");
  }
  return thumbnail;
}


export function generatedata<T extends ProductTypes>(cardType: T, item: ApiReturnDataType<T>): MiniCardMetadata<T> {
  if (cardType === "ph") {
    const ph = item as Producthunt;
    return {
      id: ph.id,
      name: ph.name || "",
      tagline: ph.tagline,
      website: ph.website || "",
      uuid: ph.uuid || "",
      thumbnail: ph.thumbnail?.url || "",
      votesCount: ph.votesCount || 0,
      producthunt_url: ph.url || "",
      new: differenceInHours(new Date(), new Date(ph.added_at || new Date())) <= 24
    } as MiniCardMetadata<T>
  } else if (cardType === "yc") {
    const company = item as YC;
    return {
      ...company,
      thumbnail: company.thumb_url,
      new: differenceInHours(new Date(), company.launched_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>
  } else if (cardType === "taaft") {
    const taaft = item as Taaft;
    return {
      ...taaft,
      thumbnail: taaft.thumb_url,
      new: differenceInHours(new Date(), taaft.added_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>;
  } else {
    const ih = item as IndieHackers;
    
    return {
      ...ih,
      new: differenceInHours(new Date(), ih.added_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>
  }
}
