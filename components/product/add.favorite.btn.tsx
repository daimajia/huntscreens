"use client";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { add_favorite_action, remove_favorite_action } from "@/lib/api/favorites";
import { ProductTypes } from "@/types/product.types";
import { toast } from "../ui/use-toast";
import { useState } from "react";

type Props = {
  itemId: string;
  itemType: string;
  initIsFavorite: boolean;
}


const initialState = {
  error: false,
  message: "",
}

export default function AddFavoriteBtn({ itemId, itemType, initIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  
  const addProduct = add_favorite_action.bind(null, itemId, itemType as ProductTypes);
  const removeProduct = remove_favorite_action.bind(null, itemId, itemType as ProductTypes);
  return (  
      <Button
        onClick={async () => {
        setIsLoading(true);
        try{
          let res: { error: boolean; message: string; } | void = undefined;
          if(isFavorite){
            res = await removeProduct();
          }else{
            res = await addProduct();
          }
          if(typeof res === "object"){
            toast({
              title: res.message,
              variant: res.error ? "destructive" : "default",
            })
            if(!res.error){
              setIsFavorite(!isFavorite);
            }
          }
          setIsLoading(false);
        }catch(e){
          toast({
            title: "Error",
            variant: "destructive",
          })
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
      variant="outline"
      size="icon"
      aria-label="Add to favorites"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isFavorite ? <Star fill="#f97316" className="w-5 h-5 text-orange-500" /> : <Star className="w-5 h-5 text-gray-500" />}
      </Button>
  )
}