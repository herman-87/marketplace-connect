import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Store, Star, MapPin, ArrowRight, Verified, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const featuredShops = [
  {
    id: "1",
    name: "RestauFast",
    category: "Restaurant",
    description: "Cuisine rapide et savoureuse",
    rating: 4.8,
    reviewsCount: 342,
    location: "Paris 11ème",
    productsCount: 24,
    isVerified: true,
    gradient: "from-orange-500 to-red-500",
    followers: 1250,
  },
  {
    id: "2",
    name: "TechStore",
    category: "High-Tech",
    description: "Les meilleurs gadgets au meilleur prix",
    rating: 4.6,
    reviewsCount: 189,
    location: "Paris 8ème",
    productsCount: 156,
    isVerified: true,
    gradient: "from-blue-500 to-indigo-500",
    followers: 890,
  },
  {
    id: "3",
    name: "ModeBoutique",
    category: "Mode",
    description: "Tendances et styles uniques",
    rating: 4.7,
    reviewsCount: 256,
    location: "Paris 3ème",
    productsCount: 89,
    isVerified: false,
    gradient: "from-pink-500 to-purple-500",
    followers: 2100,
  },
  {
    id: "4",
    name: "GourmetShop",
    category: "Épicerie Fine",
    description: "Produits d'exception du monde entier",
    rating: 4.9,
    reviewsCount: 178,
    location: "Paris 6ème",
    productsCount: 67,
    isVerified: true,
    gradient: "from-emerald-500 to-teal-500",
    followers: 567,
  },
];

export function FeaturedShops() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Boutiques Vedettes
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Les meilleures boutiques de la plateforme
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Voir tout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredShops.map((shop) => (
          <Card 
            key={shop.id} 
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Header with gradient */}
            <div className={cn(
              "relative h-20 bg-gradient-to-br",
              shop.gradient
            )}>
              {/* Follow Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
              >
                <Heart className="w-4 h-4" />
              </Button>

              {/* Avatar */}
              <div className="absolute -bottom-6 left-4">
                <Avatar className="h-14 w-14 border-4 border-card">
                  <AvatarFallback className="bg-card text-foreground font-bold">
                    {shop.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <CardContent className="pt-8 pb-4 px-4">
              {/* Name & Verified */}
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground">{shop.name}</h3>
                {shop.isVerified && (
                  <Verified className="w-4 h-4 text-primary fill-primary/20" />
                )}
              </div>

              {/* Category */}
              <Badge variant="secondary" className="mt-1 text-[10px]">
                {shop.category}
              </Badge>

              {/* Description */}
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {shop.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span className="font-medium text-foreground">{shop.rating}</span>
                  <span>({shop.reviewsCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{shop.location}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="text-xs">
                  <span className="font-semibold text-foreground">{shop.productsCount}</span>
                  <span className="text-muted-foreground"> produits</span>
                </div>
                <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-primary">
                  Visiter
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
