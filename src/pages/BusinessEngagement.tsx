import { AppLayout } from "@/components/layout/AppLayout";
import { EngagementPanel } from "@/components/business/EngagementPanel";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessEngagement() {
  return (
    <AppLayout title={mockBusiness.name} subtitle="Suivez l'engagement et la popularité de vos produits">
      <div className="animate-fade-in">
        <BusinessMobileNav />
        <EngagementPanel stats={mockEngagement} />
      </div>
    </AppLayout>
  );
}
