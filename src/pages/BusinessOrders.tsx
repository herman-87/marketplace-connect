import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessOrders as BusinessOrdersComponent } from "@/components/business/BusinessOrders";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockOrders } from "@/data/businessMockData";

export default function BusinessOrders() {
  return (
    <AppLayout title={mockBusiness.name} subtitle="Gérez les commandes de votre boutique">
      <div className="animate-fade-in">
        <BusinessMobileNav />
        <BusinessOrdersComponent orders={mockOrders} />
      </div>
    </AppLayout>
  );
}
