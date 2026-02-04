import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

interface FavoriteItem {
  id: string;
  name: string;
  businessId: string;
}

interface FavoritesContextType {
  favorites: Set<string>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: FavoriteItem) => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const isFavorite = useCallback((productId: string) => {
    return favorites.has(productId);
  }, [favorites]);

  const toggleFavorite = useCallback((product: FavoriteItem) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(product.id)) {
        newFavorites.delete(product.id);
        toast.info(`${product.name} retiré des favoris`);
      } else {
        newFavorites.add(product.id);
        toast.success(`${product.name} ajouté aux favoris`);
      }
      return newFavorites;
    });
  }, []);

  const favoritesCount = favorites.size;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
