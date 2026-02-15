import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Star, 
  ShoppingCart, 
  Heart,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link } from "react-router-dom";

const trendingProducts = [
  {
    id: "trend-1",
    name: "Montre Connectée Pro",
    description: "Suivi santé, GPS, 7 jours d'autonomie",
    price: 149.99,
    businessId: "techstore",
    businessName: "TechStore",
    rating: 4.7,
    reviewsCount: 89,
    sales: 156,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  },
  {
    id: "trend-2",
    name: "Sac à dos Urban",
    description: "Imperméable, compartiment laptop",
    price: 59.99,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.6,
    reviewsCount: 67,
    sales: 78,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
  },
  {
    id: "trend-3",
    name: "Sneakers Urban Limited",
    description: "Édition limitée, design exclusif",
    price: 89.99,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.8,
    reviewsCount: 312,
    sales: 203,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
  },
  {
    id: "trend-4",
    name: "Casque Audio Premium",
    description: "Réduction de bruit active, Hi-Fi",
    price: 199.99,
    businessId: "techstore",
    businessName: "TechStore",
    rating: 4.9,
    reviewsCount: 189,
    sales: 134,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
  },
  {
    id: "trend-5",
    name: "Enceinte Bluetooth",
    description: "Son 360°, étanche, 20h autonomie",
    price: 69.99,
    businessId: "techstore",
    businessName: "TechStore",
    rating: 4.5,
    reviewsCount: 56,
    sales: 45,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
  },
  {
    id: "trend-6",
    name: "Robe Wax Ankara",
    description: "Tissu africain authentique",
    price: 45.00,
    businessId: "modeboutique",
    businessName: "ModeBoutique",
    rating: 4.7,
    reviewsCount: 98,
    sales: 34,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=200&fit=crop",
  },
];

export function TrendingProducts() {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = (product: typeof trendingProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      businessId: product.businessId,
      businessName: product.businessName,
    });
  };

  const handleToggleFavorite = (product: typeof trendingProducts[0]) => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      businessId: product.businessId,
    });
  };

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
        <Link to="/marketplace/trending">
          <Button variant="outline" size="sm" className="gap-1">
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {trendingProducts.map((product, index) => {
          const liked = isFavorite(product.id);

          return (
            <Link key={product.id} to={`/product/${product.id}`}>
            <Card 
              className="group overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer h-full"
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
                  <ShoppingBag className="w-2.5 h-2.5" />
                  Article
                </Badge>

                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleFavorite(product);
                  }}
                  className={cn(
                    "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all",
                    liked 
                      ? "bg-destructive text-destructive-foreground" 
                      : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-destructive opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
                </button>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
