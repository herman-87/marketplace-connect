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
import { PaginationControls } from "@/components/marketplace/PaginationControls";

const allPromotions = [
  { id: "promo-1", name: "Écouteurs Bluetooth Pro", originalPrice: 129.99, discountPrice: 79.99, discount: 38, businessId: "techstore", businessName: "TechStore", rating: 4.6, endsIn: "5h 12m", stock: 5, category: "High-Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { id: "promo-2", name: "Sneakers Urban", originalPrice: 89.99, discountPrice: 59.99, discount: 33, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.7, endsIn: "3h 20m", stock: 3, category: "Mode", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "promo-3", name: "Sac à dos premium", originalPrice: 69.99, discountPrice: 39.99, discount: 43, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.5, endsIn: "6h 10m", stock: 15, category: "Mode", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
  { id: "promo-4", name: "Montre connectée Sport", originalPrice: 199.99, discountPrice: 129.99, discount: 35, businessId: "techstore", businessName: "TechStore", rating: 4.7, endsIn: "8h 30m", stock: 7, category: "High-Tech", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { id: "promo-5", name: "Veste en jean vintage", originalPrice: 79.99, discountPrice: 49.99, discount: 38, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.3, endsIn: "2h 50m", stock: 4, category: "Mode", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop" },
  { id: "promo-6", name: "Casque Audio Premium", originalPrice: 249.99, discountPrice: 179.99, discount: 28, businessId: "techstore", businessName: "TechStore", rating: 4.8, endsIn: "4h 05m", stock: 10, category: "High-Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { id: "promo-7", name: "Lunettes de soleil Aviator", originalPrice: 59.99, discountPrice: 34.99, discount: 42, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.4, endsIn: "1h 15m", stock: 20, category: "Mode", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop" },
  { id: "promo-8", name: "Enceinte Bluetooth Portable", originalPrice: 89.99, discountPrice: 54.99, discount: 39, businessId: "techstore", businessName: "TechStore", rating: 4.6, endsIn: "7h 45m", stock: 6, category: "High-Tech", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
  { id: "promo-9", name: "Clavier Mécanique RGB", originalPrice: 149.99, discountPrice: 89.99, discount: 40, businessId: "techstore", businessName: "TechStore", rating: 4.8, endsIn: "9h 00m", stock: 12, category: "High-Tech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop" },
  { id: "promo-10", name: "Robe Wax Élégante", originalPrice: 65.00, discountPrice: 39.00, discount: 40, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.7, endsIn: "4h 30m", stock: 8, category: "Mode", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop" },
  { id: "promo-11", name: "Souris Gaming Pro", originalPrice: 79.99, discountPrice: 44.99, discount: 44, businessId: "techstore", businessName: "TechStore", rating: 4.5, endsIn: "6h 20m", stock: 9, category: "High-Tech", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop" },
  { id: "promo-12", name: "Chemise Lin Oversize", originalPrice: 55.00, discountPrice: 29.99, discount: 45, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.4, endsIn: "3h 10m", stock: 14, category: "Mode", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop" },
  { id: "promo-13", name: "Webcam HD 1080p", originalPrice: 69.99, discountPrice: 39.99, discount: 43, businessId: "techstore", businessName: "TechStore", rating: 4.3, endsIn: "5h 40m", stock: 11, category: "High-Tech", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop" },
  { id: "promo-14", name: "Baskets Cuir Premium", originalPrice: 119.99, discountPrice: 74.99, discount: 37, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, endsIn: "7h 00m", stock: 6, category: "Mode", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "promo-15", name: "Tablette Graphique Pro", originalPrice: 159.99, discountPrice: 99.99, discount: 37, businessId: "techstore", businessName: "TechStore", rating: 4.9, endsIn: "10h 15m", stock: 3, category: "High-Tech", image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=300&fit=crop" },
  { id: "promo-16", name: "Écharpe Cachemire", originalPrice: 89.99, discountPrice: 49.99, discount: 44, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.5, endsIn: "2h 30m", stock: 18, category: "Mode", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop" },
  { id: "promo-17", name: "Hub USB-C 7-en-1", originalPrice: 49.99, discountPrice: 29.99, discount: 40, businessId: "techstore", businessName: "TechStore", rating: 4.4, endsIn: "8h 50m", stock: 25, category: "High-Tech", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop" },
  { id: "promo-18", name: "Pantalon Cargo Slim", originalPrice: 69.99, discountPrice: 42.99, discount: 39, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.3, endsIn: "5h 55m", stock: 10, category: "Mode", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop" },
  { id: "promo-19", name: "Power Bank 20000mAh", originalPrice: 59.99, discountPrice: 34.99, discount: 42, businessId: "techstore", businessName: "TechStore", rating: 4.7, endsIn: "6h 35m", stock: 16, category: "High-Tech", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop" },
  { id: "promo-20", name: "Bracelet Cuir Artisanal", originalPrice: 35.00, discountPrice: 19.99, discount: 43, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, endsIn: "1h 45m", stock: 22, category: "Mode", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { id: "promo-21", name: "Coque iPhone Design", originalPrice: 29.99, discountPrice: 14.99, discount: 50, businessId: "techstore", businessName: "TechStore", rating: 4.2, endsIn: "3h 00m", stock: 30, category: "High-Tech", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop" },
  { id: "promo-22", name: "Chapeau Fedora", originalPrice: 45.00, discountPrice: 24.99, discount: 44, businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.5, endsIn: "9h 20m", stock: 13, category: "Mode", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop" },
];

const categories = ["Tous", "Mode", "High-Tech"];
const ITEMS_PER_PAGE = 20;

export default function MarketplacePromotions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("discount");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {paginated.map((deal) => {
              const liked = isFavorite(deal.id);
              return (
                <Card key={deal.id} className="group overflow-hidden hover:border-foreground/30 transition-all duration-300">
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
            {paginated.map((deal) => {
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

        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </MarketplaceLayout>
  );
}
