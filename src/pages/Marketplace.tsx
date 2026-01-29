import { AppLayout } from "@/components/layout/AppLayout";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { CategoryShowcase } from "@/components/marketplace/CategoryShowcase";
import { FlashDeals } from "@/components/marketplace/FlashDeals";
import { FeaturedShops } from "@/components/marketplace/FeaturedShops";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { GoodDeals } from "@/components/marketplace/GoodDeals";

export default function Marketplace() {
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
    </AppLayout>
  );
}
