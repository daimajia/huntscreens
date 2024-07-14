import { Producthunt, YC } from "@/db/schema";

export type ProductTypes = "ph" | "yc";

export type ProductModel<T extends ProductTypes> = T extends "ph" ? Producthunt : YC;