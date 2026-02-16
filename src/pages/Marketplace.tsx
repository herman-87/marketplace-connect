import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { CategoryShowcase } from "@/components/marketplace/CategoryShowcase";
import { FlashDeals } from "@/components/marketplace/FlashDeals";
import { FeaturedShops } from "@/components/marketplace/FeaturedShops";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/cart/CartSheet";

export default function Marketplace() {
  const { totalItems } = useCart();

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-8 md:space-y-10 animate-fade-in">
        <HeroBanner />
        <CategoryShowcase />
        <FlashDeals />
        <FeaturedShops />
        <TrendingProducts />
      </div>

      {/* Floating Cart Button - Mobile */}
      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
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
    </MarketplaceLayout>
  );
}
