import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, Star, MapPin, ArrowRight, Verified, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useReviews } from "@/contexts/ReviewsContext";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";

const featuredShops = [
  {
    id: "1",
    name: "TechStore",
    category: "High-Tech",
    description: "Les meilleurs gadgets au meilleur prix",
    location: "Paris 8ème",
    productsCount: 156,
    isVerified: true,
    coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "ModeBoutique",
    category: "Mode",
    description: "Tendances et styles uniques",
    location: "Paris 3ème",
    productsCount: 89,
    isVerified: true,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "UrbanWear",
    category: "Streetwear",
    description: "Streetwear et accessoires tendance",
    location: "Paris 10ème",
    productsCount: 78,
    isVerified: false,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "SportZone",
    category: "Sport",
    description: "Équipements sportifs de qualité",
    location: "Paris 15ème",
    productsCount: 95,
    isVerified: true,
    coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop",
    avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
  },
];

export function FeaturedShops() {
  const { isLiked, toggleLike, getLikesCount, getAverageRating } = useReviews();

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
        <Link to="/marketplace/shops">
          <Button variant="outline" size="sm" className="gap-1">
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredShops.map((shop) => {
          const liked = isLiked("shop", shop.id);
          const likesCount = getLikesCount("shop", shop.id);
          const { average, count } = getAverageRating("shop", shop.id);

          return (
            <Card 
              key={shop.id}
              className="group overflow-hidden hover:border-foreground/30 transition-all duration-300 cursor-pointer h-full"
            >
              {/* Header with Cover Image */}
              <Link to={`/marketplace/shop/${shop.id}`}>
                <div className="relative h-20 bg-muted overflow-hidden">
                  <img 
                    src={shop.coverImage} 
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Avatar */}
                  <div className="absolute -bottom-6 left-4">
                    <Avatar className="h-14 w-14 border-4 border-card">
                      <AvatarImage src={shop.avatar} alt={shop.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {shop.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>

              {/* Like Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-card/80 hover:bg-card z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLike("shop", shop.id, shop.name);
                }}
              >
                <Heart className={cn("w-4 h-4", liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
              </Button>

              <CardContent className="pt-8 pb-4 px-4">
                <Link to={`/marketplace/shop/${shop.id}`}>
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
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{average || "—"}</span>
                      {count > 0 && <span>({count})</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      <span>{likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{shop.location}</span>
                    </div>
                  </div>
                </Link>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">{shop.productsCount}</span>
                    <span className="text-muted-foreground"> produits</span>
                  </div>
                  <ReviewDialog
                    type="shop"
                    targetId={shop.id}
                    targetName={shop.name}
                    trigger={
                      <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-primary hover:text-primary" onClick={(e) => e.stopPropagation()}>
                        <Star className="w-3 h-3" />
                        Noter
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
