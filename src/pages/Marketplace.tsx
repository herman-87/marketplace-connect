import { AppLayout } from "@/components/layout/AppLayout";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { CategoryShowcase } from "@/components/marketplace/CategoryShowcase";
import { FlashDeals } from "@/components/marketplace/FlashDeals";
import { FeaturedShops } from "@/components/marketplace/FeaturedShops";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { GoodDeals } from "@/components/marketplace/GoodDeals";
import { CartSheet } from "@/components/cart/CartSheet";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Marketplace() {
  const { totalItems } = useCart();

  return (
    <AppLayout
      title="Marketplace"
      subtitle="Découvrez tous les produits disponibles"
    >
      <div className="space-y-8 md:space-y-10 animate-fade-in">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories */}
        <CategoryShowcase />

        {/* Flash Deals */}
        <FlashDeals />

        {/* Featured Shops */}
        <FeaturedShops />

        {/* Trending Products */}
        <TrendingProducts />

        {/* Good Deals / Promo Codes */}
        <GoodDeals />
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6">
        <CartSheet 
          trigger={
            <button className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs border-2 border-background">
                  {totalItems}
                </Badge>
              )}
            </button>
          }
        />
      </div>
    </AppLayout>
  );
}
