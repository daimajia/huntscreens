import { ProductTypes } from '@/app/types/product.types'
import { createStore } from 'zustand/vanilla'

export type FavoritesState = {
  favoriteIds: string[]
}

export type FavoriteActions = {
  pushFavorites: (itemIds: string[]) => void
  addFavorite: (itemId: string, itemType: ProductTypes) => Promise<void>
  delFavorite: (itemId: string, itemType: ProductTypes) => Promise<void>
  toggleFavorite: (itemId: string, itemType: ProductTypes) => Promise<void>
  query: (itemIds: string[]) => Promise<void>
}

export type FavoriteStore = FavoritesState & FavoriteActions;

export const defaultInitState: FavoritesState = {
  favoriteIds: [],
}

export const createFavoriteStore = (
  initState: FavoritesState = defaultInitState,
) => {
  return createStore<FavoriteStore>()((set, get, setState) => ({
    ...initState,
    pushFavorites: (itemIds: string[]) => {
      set((state) => ({favoriteIds: [...itemIds, ...state.favoriteIds]}))
    },
    addFavorite: async (itemId: string, itemType: ProductTypes) => {
      set((state) => ({favoriteIds: [itemId, ...state.favoriteIds]}))
      const result = await fetch(`/api/favorites/actions/${itemType}/${itemId}`, {
        method: "PUT"
      })
    },
    delFavorite: async (itemId: string, itemType: ProductTypes) => {
      set((state) => ({
        favoriteIds: state.favoriteIds.filter(id => id !== itemId)
      }));
      const result = await fetch(`/api/favorites/actions/${itemType}/${itemId}`, {
        method: "DELETE"
      })
    },
    toggleFavorite: async (itemId: string, itemType: ProductTypes) => {
      const { favoriteIds, addFavorite, delFavorite } = get();
      if(!favoriteIds.includes(itemId)) {
        await addFavorite(itemId, itemType);
      }else{
        await delFavorite(itemId, itemType);
      }
    },
    query: async (itemIds) => {
      fetch('/api/favorites', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds }),
      })
        .then(response => response.json())
        .then(result => {
          set((state) => ({
            favoriteIds: [...state.favoriteIds, ...result]
          }));
        })
        .catch(error => {
          console.error('Error checking favorites:', error);
        });
    }
  }))
}

