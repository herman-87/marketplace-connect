import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Star,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const favoriteProducts = [
  { id: "1", name: "Montre Connectée Pro", price: 149.99, rating: 4.9, businessName: "TechStore", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop" },
  { id: "2", name: "Sac à dos Urban", price: 59.99, rating: 4.7, businessName: "ModeBoutique", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop" },
  { id: "3", name: "Sneakers Limited", price: 89.99, rating: 4.6, businessName: "ModeBoutique", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=150&fit=crop" },
];

const favoriteShops = [
  { id: "1", name: "TechStore", category: "High-Tech", rating: 4.6, productsCount: 156, avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=80&h=80&fit=crop" },
  { id: "2", name: "ModeBoutique", category: "Mode", rating: 4.7, productsCount: 89, avatar: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=80&h=80&fit=crop" },
];

export function FavoritesSection() {
  return (
    <Tabs defaultValue="products">
      <TabsList className="mb-4">
        <TabsTrigger value="products" className="gap-1.5 text-xs md:text-sm">
          <Heart className="h-3.5 w-3.5" />
          Produits ({favoriteProducts.length})
        </TabsTrigger>
        <TabsTrigger value="shops" className="gap-1.5 text-xs md:text-sm">
          <Store className="h-3.5 w-3.5" />
          Boutiques ({favoriteShops.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:border-foreground transition-all">
              <div className="relative h-28 bg-muted overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </Button>
              </div>
              <CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground">{product.businessName}</p>
                <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-foreground">{product.price.toFixed(2)} €</span>
                  <Button size="sm" className="h-7 text-xs gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="shops">
        <div className="space-y-3">
          {favoriteShops.map((shop) => (
            <Card key={shop.id} className="hover:border-foreground transition-all">
              <CardContent className="p-3 md:p-4 flex items-center gap-3">
                <img src={shop.avatar} alt={shop.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{shop.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{shop.category}</Badge>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span>{shop.rating}</span>
                    </div>
                    <span>{shop.productsCount} produits</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs">Visiter</Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
