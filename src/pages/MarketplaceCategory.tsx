import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  UtensilsCrossed,
  ShoppingBag,
  TrendingUp,
  Zap,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const allProducts = [
  { id: "trend-1", name: "Poulet Yassa", description: "Poulet mariné aux oignons et citron", price: 15.9, originalPrice: 19.9, category: "repas", businessId: "saveurs-afrique", businessName: "Saveurs d'Afrique", rating: 4.9, reviewsCount: 234, sales: 156, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop" },
  { id: "trend-2", name: "Montre Connectée Pro", description: "Suivi santé, GPS, 7 jours d'autonomie", price: 149.99, category: "articles", businessId: "techstore", businessName: "TechStore", rating: 4.7, reviewsCount: 89, sales: 78, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { id: "trend-3", name: "Thieboudienne Royal", description: "Riz au poisson, légumes frais", price: 18.5, category: "repas", businessId: "teranga", businessName: "Teranga Cuisine", rating: 4.8, reviewsCount: 312, sales: 203, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop" },
  { id: "trend-4", name: "Sac à dos Urban", description: "Imperméable, compartiment laptop", price: 59.99, category: "articles", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.6, reviewsCount: 67, sales: 45, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
  { id: "trend-5", name: "Mafé Traditionnel", description: "Sauce arachide, bœuf tendre", price: 14.9, category: "repas", businessId: "mama-africa", businessName: "Mama Africa", rating: 4.9, reviewsCount: 189, sales: 134, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop" },
  { id: "trend-6", name: "Enceinte Bluetooth", description: "Son 360°, étanche, 20h autonomie", price: 69.99, originalPrice: 89.99, category: "articles", businessId: "techstore", businessName: "TechStore", rating: 4.5, reviewsCount: 56, sales: 34, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
  { id: "trend-7", name: "Attiéké Poisson Braisé", description: "Semoule de manioc, poisson grillé", price: 12.5, category: "repas", businessId: "saveurs-abidjan", businessName: "Saveurs d'Abidjan", rating: 4.7, reviewsCount: 145, sales: 98, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
  { id: "trend-8", name: "Écouteurs Sans Fil", description: "Réduction de bruit, 30h autonomie", price: 89.99, originalPrice: 119.99, category: "articles", businessId: "techstore", businessName: "TechStore", rating: 4.8, reviewsCount: 203, sales: 167, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { id: "trend-9", name: "Ndolé Camerounais", description: "Feuilles amères, crevettes, arachides", price: 16.9, category: "repas", businessId: "douala-food", businessName: "Douala Food", rating: 4.6, reviewsCount: 78, sales: 52, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
  { id: "trend-10", name: "Sneakers Sport Pro", description: "Légères, amorties, respirantes", price: 79.99, category: "articles", businessId: "modeboutique", businessName: "ModeBoutique", rating: 4.4, reviewsCount: 34, sales: 22, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "trend-11", name: "Jollof Rice Special", description: "Riz épicé, poulet grillé", price: 13.9, category: "repas", businessId: "lagos-kitchen", businessName: "Lagos Kitchen", rating: 4.8, reviewsCount: 256, sales: 189, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop" },
  { id: "trend-12", name: "Lampe LED Design", description: "Tactile, 3 intensités, rechargeable", price: 34.99, category: "articles", businessId: "techstore", businessName: "TechStore", rating: 4.3, reviewsCount: 45, sales: 28, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
];

const sectionConfig: Record<string, { title: string; icon: React.ElementType; description: string }> = {
  trending: { title: "Tendances du moment", icon: TrendingUp, description: "Les produits les plus populaires" },
  flash: { title: "Ventes Flash", icon: Zap, description: "Offres limitées dans le temps" },
  deals: { title: "Bons Plans", icon: Tag, description: "Les meilleures affaires" },
};

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  repas: { label: "Repas", icon: UtensilsCrossed },
  articles: { label: "Articles", icon: ShoppingBag },
};

export default function MarketplaceCategory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get("section") || "trending";
  const config = sectionConfig[section] || sectionConfig.trending;
  const SectionIcon = config.icon;

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = allProducts
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.businessName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === "all" || p.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.sales - a.sales;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, businessId: product.businessId, businessName: product.businessName });
  };

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/marketplace")} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="p-2 rounded-lg bg-primary/10">
            <SectionIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">{filtered.length} produits</Badge>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="repas">Repas</SelectItem>
                <SelectItem value="articles">Articles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Plus populaires</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-md">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-r-none" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="rounded-l-none" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid / List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const cat = categoryConfig[product.category];
              const CatIcon = cat.icon;
              const liked = isFavorite(product.id);
              return (
                <Card key={product.id} className="group overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <Badge variant="secondary" className="absolute bottom-2 left-2 gap-0.5 text-[10px] px-1.5">
                      <CatIcon className="w-2.5 h-2.5" />
                      {cat.label}
                    </Badge>
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px]">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                    <button
                      onClick={() => toggleFavorite({ id: product.id, name: product.name, businessId: product.businessId })}
                      className={cn(
                        "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        liked ? "bg-destructive text-destructive-foreground" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-destructive opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                    </button>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-[11px] text-muted-foreground truncate">{product.businessName}</p>
                    <h3 className="font-semibold text-sm text-foreground truncate mt-0.5">{product.name}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{product.description}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({product.reviewsCount})</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{product.sales} vendus</span>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div>
                        <span className="text-base font-bold text-foreground">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-1">{product.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <Button size="icon" className="h-8 w-8" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => {
              const cat = categoryConfig[product.category];
              const CatIcon = cat.icon;
              const liked = isFavorite(product.id);
              return (
                <Card key={product.id} className="group overflow-hidden hover:border-primary/30 transition-all">
                  <div className="flex gap-4 p-3">
                    <div className="relative w-32 h-24 sm:w-40 sm:h-28 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                      {product.originalPrice && (
                        <Badge className="absolute top-1 left-1 bg-destructive text-destructive-foreground text-[10px]">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="gap-0.5 text-[10px] px-1.5 shrink-0">
                              <CatIcon className="w-2.5 h-2.5" />
                              {cat.label}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground truncate">{product.businessName}</span>
                          </div>
                          <h3 className="font-semibold text-sm text-foreground mt-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite({ id: product.id, name: product.name, businessId: product.businessId })}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
                            liked ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-destructive"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-xs font-medium">{product.rating}</span>
                            <span className="text-[10px] text-muted-foreground">({product.reviewsCount})</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{product.sales} vendus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-base font-bold text-foreground">{product.price.toFixed(2)} €</span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through ml-1">{product.originalPrice.toFixed(2)} €</span>
                            )}
                          </div>
                          <Button size="icon" className="h-8 w-8" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Aucun produit trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
