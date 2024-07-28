import React, { createContext, useContext, useRef } from 'react'
import { useStore, StoreApi } from 'zustand'
import { createFavoriteStore, FavoriteStore, FavoritesState } from './favorites.store'

const FavoriteStoreContext = createContext<StoreApi<FavoriteStore> | null>(null)

type FavoriteStoreProviderProps = React.PropsWithChildren<{
  initialState?: FavoritesState
}>

export const FavoriteStoreProvider: React.FC<FavoriteStoreProviderProps> = ({ children, initialState }) => {
  const storeRef = useRef<StoreApi<FavoriteStore>>()
  if (!storeRef.current) {
    storeRef.current = createFavoriteStore(initialState)
  }
  return (
    <FavoriteStoreContext.Provider value={storeRef.current}>
      {children}
    </FavoriteStoreContext.Provider>
  )
}

export const useFavoriteStore = <T,>(selector: (state: FavoriteStore) => T): T => {
  const store = useContext(FavoriteStoreContext)
  if (!store) {
    throw new Error('useFavoriteStore must be used within a FavoriteStoreProvider')
  }
  return useStore(store, selector)
}

export const useFavoriteIds = () => useFavoriteStore(state => state.favoriteIds)
export const useAddFavorite = () => useFavoriteStore(state => state.addFavorite)
export const useDelFavorite = () => useFavoriteStore(state => state.delFavorite)
export const useQueryFavorite = () => useFavoriteStore(state => state.query)
export const useToggleFavorite = () => useFavoriteStore(state => state.toggleFavorite);