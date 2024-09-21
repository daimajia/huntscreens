import { SupportedLangs } from "@/i18n/types";

export const productTypes = ["ph", "yc", "taaft", "indiehackers"] as const;
export type ProductTypes = (typeof productTypes)[number];

  export const urlMapper: Record<ProductTypes, (id: string | number, locale?: SupportedLangs) => string> = {
    "ph" : (id, locale = undefined) =>  locale ? `/${locale}/p/${id}` : `/p/${id}`,
    "yc" : (id, locale = undefined) => locale ? `/${locale}/startup/yc/${id}` : `/startup/yc/${id}`,
    "indiehackers": (id, locale = undefined) => locale ? `/${locale}/indiehackers/${id}` : `/indiehackers/${id}`,
    "taaft" : (id, locale = undefined) => locale ? `/${locale}/taaft/${id}` : `/taaft/${id}`
  }