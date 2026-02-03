import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Star, 
  ShoppingCart, 
  Heart,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const trendingProducts = [
  {
    id: "1",
    name: "Poulet Yassa",
    description: "Poulet mariné aux oignons et citron",
    price: 15.90,
    category: "repas",
    businessName: "Saveurs d'Afrique",
    rating: 4.9,
    reviewsCount: 234,
    sales: 156,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Montre Connectée Pro",
    description: "Suivi santé, GPS, 7 jours d'autonomie",
    price: 149.99,
    category: "articles",
    businessName: "TechStore",
    rating: 4.7,
    reviewsCount: 89,
    sales: 78,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Thieboudienne Royal",
    description: "Riz au poisson, légumes frais",
    price: 18.50,
    category: "repas",
    businessName: "Teranga Cuisine",
    rating: 4.8,
    reviewsCount: 312,
    sales: 203,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Sac à dos Urban",
    description: "Imperméable, compartiment laptop",
    price: 59.99,
    category: "articles",
    businessName: "ModeBoutique",
    rating: 4.6,
    reviewsCount: 67,
    sales: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Mafé Traditionnel",
    description: "Sauce arachide, bœuf tendre",
    price: 14.90,
    category: "repas",
    businessName: "Mama Africa",
    rating: 4.9,
    reviewsCount: 189,
    sales: 134,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Enceinte Bluetooth",
    description: "Son 360°, étanche, 20h autonomie",
    price: 69.99,
    category: "articles",
    businessName: "TechStore",
    rating: 4.5,
    reviewsCount: 56,
    sales: 34,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
  },
];

const categoryConfig = {
  repas: {
    label: "Repas",
    icon: UtensilsCrossed,
  },
  articles: {
    label: "Articles",
    icon: ShoppingBag,
  },
};

export function TrendingProducts() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Tendances du moment
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Les produits les plus populaires cette semaine
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Voir tout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {trendingProducts.map((product, index) => {
          const config = categoryConfig[product.category as keyof typeof categoryConfig];
          const CategoryIcon = config.icon;

          return (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              {/* Image Area */}
              <div className="relative h-24 sm:h-32 bg-muted overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rank Badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                {/* Category Badge */}
                <Badge
                  variant="secondary"
                  className="absolute bottom-2 left-2 gap-0.5 text-[10px] px-1.5"
                >
                  <CategoryIcon className="w-2.5 h-2.5" />
                  {config.label}
                </Badge>

                {/* Wishlist */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 bg-card/80 hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>

              <CardContent className="p-2 sm:p-3">
                <p className="text-[10px] text-muted-foreground truncate">
                  {product.businessName}
                </p>
                <h3 className="font-semibold text-xs sm:text-sm text-foreground truncate mt-0.5">
                  {product.name}
                </h3>

                {/* Rating & Sales */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-[10px] font-medium">{product.rating}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    • {product.sales} vendus
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {product.price.toFixed(2)} €
                  </span>
                  <Button 
                    size="icon" 
                    className="h-7 w-7"
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
