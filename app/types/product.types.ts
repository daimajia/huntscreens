import { Producthunt, Taaft, YC } from "@/db/schema";

export type ProductTypes = "ph" | "yc" | "taaft";

export type ApiReturnDataType<T extends ProductTypes> =
  T extends "ph" ? Producthunt :
  T extends "yc" ? YC :
  T extends "taaft" ? Taaft :
  never;

export const urlMapper: Record<ProductTypes, (id: string | number) => string> = {
  "ph" : (id) => `/p/${id}`,
  "yc" : (id) => `/startup/yc/${id}`,
  "taaft" : (id) => `/taaft/${id}`
}

export type ProductModel<T extends ProductTypes> = ApiReturnDataType<T>;
