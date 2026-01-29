import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Flame, ShoppingCart, Star, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const flashDeals = [
  {
    id: "1",
    name: "Burger Deluxe Menu",
    originalPrice: 18.90,
    discountPrice: 12.90,
    discount: 32,
    businessName: "RestauFast",
    rating: 4.8,
    imageGradient: "from-orange-400 to-red-500",
    endsIn: "2h 34m",
    stock: 12,
  },
  {
    id: "2",
    name: "Écouteurs Bluetooth Pro",
    originalPrice: 129.99,
    discountPrice: 79.99,
    discount: 38,
    businessName: "TechStore",
    rating: 4.6,
    imageGradient: "from-blue-400 to-indigo-500",
    endsIn: "5h 12m",
    stock: 5,
  },
  {
    id: "3",
    name: "Pizza Familiale",
    originalPrice: 24.90,
    discountPrice: 16.90,
    discount: 32,
    businessName: "PizzaRoma",
    rating: 4.9,
    imageGradient: "from-yellow-400 to-orange-500",
    endsIn: "1h 45m",
    stock: 8,
  },
  {
    id: "4",
    name: "Sneakers Urban",
    originalPrice: 89.99,
    discountPrice: 59.99,
    discount: 33,
    businessName: "ModeBoutique",
    rating: 4.7,
    imageGradient: "from-purple-400 to-pink-500",
    endsIn: "3h 20m",
    stock: 3,
  },
];

export function FlashDeals() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Flame className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Ventes Flash
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Offres limitées dans le temps
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Clock className="w-4 h-4" />
          Voir tout
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {flashDeals.map((deal) => (
          <Card 
            key={deal.id} 
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-destructive/20"
          >
            {/* Image Area */}
            <div className={cn(
              "relative h-28 sm:h-36 bg-gradient-to-br",
              deal.imageGradient
            )}>
              {/* Discount Badge */}
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground border-0 gap-1">
                <Percent className="w-3 h-3" />
                -{deal.discount}%
              </Badge>

              {/* Timer */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3" />
                  <span>Fin dans {deal.endsIn}</span>
                </div>
              </div>

              {/* Stock Warning */}
              {deal.stock <= 5 && (
                <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground border-0 text-[10px]">
                  Plus que {deal.stock}
                </Badge>
              )}
            </div>

            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {deal.businessName}
              </p>
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mt-0.5">
                {deal.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-xs font-medium">{deal.rating}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg sm:text-xl font-bold text-destructive">
                  {deal.discountPrice.toFixed(2)} €
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  {deal.originalPrice.toFixed(2)} €
                </span>
              </div>

              {/* Add Button */}
              <Button 
                size="sm" 
                className="w-full mt-3 bg-destructive hover:bg-destructive/90 gap-1 text-xs"
              >
                <ShoppingCart className="w-3 h-3" />
                Ajouter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
