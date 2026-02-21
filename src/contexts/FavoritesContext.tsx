import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { user } = useAuth();

  const isFavorite = useCallback((productId: string) => {
    return favorites.has(productId);
  }, [favorites]);

  const toggleFavorite = useCallback((product: FavoriteItem) => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }

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
  }, [user]);

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
      <AuthAlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert} />
    </FavoritesContext.Provider>
  );
}

function AuthAlertDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Connexion requise</AlertDialogTitle>
          <AlertDialogDescription>
            Vous devez être connecté pour ajouter des articles à vos favoris. Souhaitez-vous vous connecter maintenant ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Non, plus tard</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/auth")}>
            Oui, me connecter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
