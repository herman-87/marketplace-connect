import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  UtensilsCrossed,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "repas" | "articles";
  businessName: string;
  rating: number;
  reviewsCount: number;
  imageUrl?: string;
  isNew?: boolean;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Burger Gourmet",
    description: "Bœuf Angus, cheddar affiné, sauce maison",
    price: 14.90,
    category: "repas",
    businessName: "RestauFast",
    rating: 4.8,
    reviewsCount: 124,
    isNew: true,
  },
  {
    id: "2",
    name: "Écouteurs Bluetooth Pro",
    description: "Réduction de bruit active, 30h d'autonomie",
    price: 89.99,
    category: "articles",
    businessName: "TechStore",
    rating: 4.6,
    reviewsCount: 89,
  },
  {
    id: "3",
    name: "Salade César",
    description: "Poulet grillé, parmesan, croûtons maison",
    price: 12.50,
    category: "repas",
    businessName: "RestauFast",
    rating: 4.5,
    reviewsCount: 67,
  },
  {
    id: "4",
    name: "T-shirt Premium",
    description: "100% coton biologique, coupe moderne",
    price: 34.99,
    category: "articles",
    businessName: "ModeBoutique",
    rating: 4.7,
    reviewsCount: 203,
    isNew: true,
  },
  {
    id: "5",
    name: "Pizza Margherita",
    description: "Tomate San Marzano, mozzarella di bufala",
    price: 13.90,
    category: "repas",
    businessName: "GourmetShop",
    rating: 4.9,
    reviewsCount: 156,
  },
  {
    id: "6",
    name: "Chargeur USB-C Rapide",
    description: "65W, charge rapide pour tous appareils",
    price: 29.99,
    category: "articles",
    businessName: "TechStore",
    rating: 4.4,
    reviewsCount: 45,
  },
];

const categoryConfig = {
  repas: {
    label: "Repas",
    icon: UtensilsCrossed,
    color: "bg-category-repas",
  },
  articles: {
    label: "Articles",
    icon: ShoppingBag,
    color: "bg-category-articles",
  },
};

function ProductCard({ product }: { product: Product }) {
  const config = categoryConfig[product.category];
  const CategoryIcon = config.icon;

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden card-hover">
      {/* Image */}
      <div className={cn("h-40 relative", config.color)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge
          className="absolute top-3 left-3 gap-1 bg-white/90 text-foreground border-0"
        >
          <CategoryIcon className="w-3 h-3" />
          {config.label}
        </Badge>

        {/* New Badge */}
        {product.isNew && (
          <Badge className="absolute top-3 right-3 gradient-primary border-0">
            Nouveau
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-3 right-3 h-8 w-8 bg-white/90 hover:bg-white text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.businessName}</p>
        <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewsCount} avis)
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">
            {product.price.toFixed(2)} €
          </p>
          <Button size="sm" className="gradient-primary border-0 gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState<"all" | "repas" | "articles">("all");

  const filteredProducts = activeCategory === "all"
    ? mockProducts
    : mockProducts.filter((p) => p.category === activeCategory);

  return (
    <AppLayout
      title="Marketplace"
      subtitle="Découvrez tous les produits disponibles"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-9 w-full sm:w-80"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-md",
                activeCategory === "all" && "bg-card shadow-sm"
              )}
              onClick={() => setActiveCategory("all")}
            >
              Tous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-md gap-1.5",
                activeCategory === "repas" && "bg-card shadow-sm"
              )}
              onClick={() => setActiveCategory("repas")}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Repas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-md gap-1.5",
                activeCategory === "articles" && "bg-card shadow-sm"
              )}
              onClick={() => setActiveCategory("articles")}
            >
              <ShoppingBag className="w-4 h-4" />
              Articles
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredProducts.length} produits trouvés</span>
          <span>•</span>
          <span>4 boutiques</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
