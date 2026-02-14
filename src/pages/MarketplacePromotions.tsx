import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Percent,
  Clock,
  Star,
  ShoppingCart,
  Heart,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const allPromotions = [
  {
    id: "promo-1",
    name: "Burger Deluxe Menu",
    originalPrice: 18.9,
    discountPrice: 12.9,
    discount: 32,
    businessId: "restaufast",
    businessName: "RestauFast",
    rating: 4.8,
    endsIn: "2h 34m",
    stock: 12,
    category: "Repas",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  },
  {
    id: "promo-2",
    name: "Écouteurs Bluetooth Pro",
    originalPrice: 129.99,
    discountPrice: 79.99,
    discount: 38,
    businessId: "techstore",
    businessName: "TechStore",
    rating: 4.6,
    endsIn: "5h 12m",
    stock: 5,
    category: "High-Tech",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: "promo-3",
    name: "Pizza Familiale",
    originalPrice: 24.9,
    discountPrice: 16.9,
    discount: 32,
    businessId: "pizzaroma",
    businessName: "PizzaRoma",
    rating: 4.9,
    endsIn: "1h 45m",
    stock: 8,
    category: "Repas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  },
  {
    id: "promo-4",
    name: "Sneakers Urban",
    originalPrice: 89.99,
    discountPrice: 59.99,
    discount: 33,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.7,
    endsIn: "3h 20m",
    stock: 3,
    category: "Mode",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  },
  {
    id: "promo-5",
    name: "Sac à dos premium",
    originalPrice: 69.99,
    discountPrice: 39.99,
    discount: 43,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.5,
    endsIn: "6h 10m",
    stock: 15,
    category: "Mode",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  },
  {
    id: "promo-6",
    name: "Tacos Poulet XXL",
    originalPrice: 14.5,
    discountPrice: 9.9,
    discount: 32,
    businessId: "restaufast",
    businessName: "RestauFast",
    rating: 4.4,
    endsIn: "4h 05m",
    stock: 20,
    category: "Repas",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
  },
  {
    id: "promo-7",
    name: "Montre connectée Sport",
    originalPrice: 199.99,
    discountPrice: 129.99,
    discount: 35,
    businessId: "techstore",
    businessName: "TechStore",
    rating: 4.7,
    endsIn: "8h 30m",
    stock: 7,
    category: "High-Tech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  },
  {
    id: "promo-8",
    name: "Veste en jean vintage",
    originalPrice: 79.99,
    discountPrice: 49.99,
    discount: 38,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.3,
    endsIn: "2h 50m",
    stock: 4,
    category: "Mode",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
  },
];

const categories = ["Tous", "Repas", "Mode", "High-Tech"];

export default function MarketplacePromotions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("discount");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = allPromotions
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.businessName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "Tous" || p.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "discount") return b.discount - a.discount;
      if (sortBy === "price-asc") return a.discountPrice - b.discountPrice;
      if (sortBy === "price-desc") return b.discountPrice - a.discountPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (deal: typeof allPromotions[0]) => {
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.discountPrice,
      image: deal.image,
      businessId: deal.businessId,
      businessName: deal.businessName,
    });
  };

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/marketplace">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Promotions</h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} offre{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une promotion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">% réduction</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleurs avis</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Percent className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Aucune promotion trouvée</h3>
            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((deal) => {
              const liked = isFavorite(deal.id);
              return (
                <Card key={deal.id} className="group overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="relative h-36 sm:h-44 bg-muted overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 gap-1">
                      <Percent className="w-3 h-3" />
                      -{deal.discount}%
                    </Badge>
                    <button
                      onClick={() => toggleFavorite({ id: deal.id, name: deal.name, businessId: deal.businessId })}
                      className={cn(
                        "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        liked
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-destructive"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 bg-foreground/80 backdrop-blur-sm text-background text-xs px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>Fin dans {deal.endsIn}</span>
                      </div>
                    </div>
                    {deal.stock <= 5 && (
                      <Badge className="absolute bottom-2 right-2 bg-muted text-muted-foreground border-0 text-[10px]">
                        {deal.stock} restants
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{deal.businessName}</p>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mt-0.5">{deal.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{deal.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg sm:text-xl font-bold text-primary">{deal.discountPrice.toFixed(2)} €</span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">{deal.originalPrice.toFixed(2)} €</span>
                    </div>
                    <Button size="sm" className="w-full mt-3 gap-1 text-xs" onClick={() => handleAddToCart(deal)}>
                      <ShoppingCart className="w-3 h-3" />
                      Ajouter
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((deal) => {
              const liked = isFavorite(deal.id);
              return (
                <Card key={deal.id} className="overflow-hidden hover:border-primary/30 transition-all">
                  <div className="flex">
                    <div className="relative w-32 sm:w-44 shrink-0 bg-muted overflow-hidden">
                      <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" loading="lazy" />
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 gap-1 text-[10px]">
                        -{deal.discount}%
                      </Badge>
                    </div>
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{deal.businessName}</p>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">{deal.name}</h3>
                          </div>
                          <button
                            onClick={() => toggleFavorite({ id: deal.id, name: deal.name, businessId: deal.businessId })}
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0",
                              liked
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-muted text-muted-foreground hover:text-destructive"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-medium">{deal.rating}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Fin dans {deal.endsIn}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{deal.discountPrice.toFixed(2)} €</span>
                          <span className="text-xs text-muted-foreground line-through">{deal.originalPrice.toFixed(2)} €</span>
                        </div>
                        <Button size="sm" className="gap-1 text-xs" onClick={() => handleAddToCart(deal)}>
                          <ShoppingCart className="w-3 h-3" />
                          Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
