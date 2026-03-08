import { AppLayout } from "@/components/layout/AppLayout";
import { PromotionsFeed } from "@/components/business/PromotionsFeed";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockPromotions } from "@/data/businessMockData";

export default function BusinessPromotions() {
  return (
    <AppLayout title={mockBusiness.name} subtitle="Gérez les promotions de votre boutique">
      <div className="animate-fade-in">
        <BusinessMobileNav />
        <PromotionsFeed promotions={mockPromotions} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
