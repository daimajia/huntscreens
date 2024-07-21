import { IndieHackers, Producthunt, Taaft, YC } from "@/db/schema";

export type ProductTypes = "ph" | "yc" | "taaft" | "indiehackers";

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