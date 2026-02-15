import { AppLayout } from "@/components/layout/AppLayout";
import { ProductsFeed } from "@/components/business/ProductsFeed";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockProducts } from "@/data/businessMockData";

export default function BusinessProducts() {
  return (
    <AppLayout title={mockBusiness.name} subtitle="Gérez les produits de votre boutique">
      <div className="animate-fade-in">
        <BusinessMobileNav />
        <ProductsFeed products={mockProducts} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
