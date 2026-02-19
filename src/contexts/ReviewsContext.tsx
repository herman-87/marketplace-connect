import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsState {
  likes: Set<string>; // "product_1", "shop_2"
  reviews: Review[];
}

interface ReviewsContextType {
  isLiked: (type: "product" | "shop", id: string) => boolean;
  toggleLike: (type: "product" | "shop", id: string, name: string) => void;
  getLikesCount: (type: "product" | "shop", id: string) => number;
  getReviews: (type: "product" | "shop", id: string) => Review[];
  getAverageRating: (type: "product" | "shop", id: string) => { average: number; count: number };
  addReview: (type: "product" | "shop", id: string, rating: number, comment: string) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Seed some mock reviews
const initialReviews: Review[] = [
  { id: "r1", author: "Marie L.", rating: 5, comment: "Excellente montre, l'autonomie est vraiment impressionnante !", date: "Il y a 2 jours" },
  { id: "r2", author: "Pierre D.", rating: 4, comment: "Très bon produit, le GPS est précis. Je recommande !", date: "Il y a 5 jours" },
  { id: "r3", author: "Sophie M.", rating: 5, comment: "Design élégant et fonctionnalités top.", date: "Il y a 1 semaine" },
];

const initialShopReviews: Review[] = [
  { id: "sr1", author: "Lucas B.", rating: 5, comment: "Service client au top, livraison rapide !", date: "Il y a 3 jours" },
  { id: "sr2", author: "Emma R.", rating: 4, comment: "Très bonne boutique, produits de qualité.", date: "Il y a 1 semaine" },
  { id: "sr3", author: "Thomas G.", rating: 4, comment: "Large choix et bon rapport qualité-prix.", date: "Il y a 2 semaines" },
];

// Store reviews keyed by "type_id"
const initialReviewsMap: Record<string, Review[]> = {
  "product_1": initialReviews,
  "shop_1": initialShopReviews,
  "shop_2": [
    { id: "sr4", author: "Julie M.", rating: 5, comment: "Magnifiques vêtements, je recommande !", date: "Il y a 4 jours" },
    { id: "sr5", author: "Marc T.", rating: 5, comment: "Style unique et qualité exceptionnelle.", date: "Il y a 1 semaine" },
  ],
};

const initialLikeCounts: Record<string, number> = {
  "product_1": 245,
  "product_2": 123,
  "product_3": 89,
  "shop_1": 890,
  "shop_2": 2100,
  "shop_3": 670,
  "shop_4": 567,
};

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>(initialReviewsMap);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(initialLikeCounts);

  const key = (type: "product" | "shop", id: string) => `${type}_${id}`;

  const isLiked = useCallback((type: "product" | "shop", id: string) => {
    return likes.has(key(type, id));
  }, [likes]);

  const toggleLike = useCallback((type: "product" | "shop", id: string, name: string) => {
    const k = key(type, id);
    setLikes(prev => {
      const next = new Set(prev);
      if (next.has(k)) {
        next.delete(k);
        toast.info(`${name} retiré des favoris`);
        setLikeCounts(c => ({ ...c, [k]: Math.max(0, (c[k] || 0) - 1) }));
      } else {
        next.add(k);
        toast.success(`${name} ajouté aux favoris ❤️`);
        setLikeCounts(c => ({ ...c, [k]: (c[k] || 0) + 1 }));
      }
      return next;
    });
  }, []);

  const getLikesCount = useCallback((type: "product" | "shop", id: string) => {
    return likeCounts[key(type, id)] || 0;
  }, [likeCounts]);

  const getReviews = useCallback((type: "product" | "shop", id: string) => {
    return reviewsMap[key(type, id)] || [];
  }, [reviewsMap]);

  const getAverageRating = useCallback((type: "product" | "shop", id: string) => {
    const reviews = reviewsMap[key(type, id)] || [];
    if (reviews.length === 0) return { average: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
  }, [reviewsMap]);

  const addReview = useCallback((type: "product" | "shop", id: string, rating: number, comment: string) => {
    const k = key(type, id);
    const newReview: Review = {
      id: `r_${Date.now()}`,
      author: "Vous",
      rating,
      comment,
      date: "À l'instant",
    };
    setReviewsMap(prev => ({
      ...prev,
      [k]: [newReview, ...(prev[k] || [])],
    }));
    toast.success("Merci pour votre avis ! ⭐");
  }, []);

  return (
    <ReviewsContext.Provider value={{ isLiked, toggleLike, getLikesCount, getReviews, getAverageRating, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used within ReviewsProvider");
  return context;
}
