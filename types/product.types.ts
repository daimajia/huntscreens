
export const productTypes = ["ph", "yc", "taaft", "indiehackers"] as const;
export type ProductTypes = (typeof productTypes)[number];