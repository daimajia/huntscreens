import { ProductTypes } from "@/types/product.types";
import { add_favorite, delete_favorite } from "@/lib/api/favorites";
import { NextRequest } from "next/server";

type Params = {
  itemId: string,
  itemType: ProductTypes
}

export async function DELETE(request: NextRequest, context: {params : Params}) {
  return await delete_favorite(context.params.itemId);
}

export async function PUT(request: NextRequest, context: {params: Params}){
  return await add_favorite(context.params.itemId, context.params.itemType);
}