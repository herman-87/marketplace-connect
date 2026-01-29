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
    imageGradient: "from-yellow-400 to-orange-500",
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
    imageGradient: "from-slate-400 to-zinc-600",
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
    imageGradient: "from-red-400 to-orange-500",
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
    imageGradient: "from-gray-500 to-slate-700",
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
    imageGradient: "from-amber-400 to-orange-600",
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
    imageGradient: "from-blue-400 to-indigo-600",
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

export function TrendingProducts() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="w-5 h-5 text-success" />
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
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image Area */}
              <div className={cn(
                "relative h-24 sm:h-32 bg-gradient-to-br",
                product.imageGradient
              )}>
                {/* Rank Badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                {/* Category Badge */}
                <Badge
                  className="absolute bottom-2 left-2 gap-0.5 bg-white/90 text-foreground border-0 text-[10px] px-1.5"
                >
                  <CategoryIcon className="w-2.5 h-2.5" />
                  {config.label}
                </Badge>

                {/* Wishlist */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-3 h-3 text-foreground" />
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
                    <Star className="w-3 h-3 fill-warning text-warning" />
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
                    className="h-7 w-7 gradient-primary border-0"
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
