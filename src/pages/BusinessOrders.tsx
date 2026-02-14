import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { BusinessOrders as BusinessOrdersComponent } from "@/components/business/BusinessOrders";
import { mockBusiness, mockOrders } from "@/data/businessMockData";

export default function BusinessOrders() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />
        <BusinessOrdersComponent orders={mockOrders} />
      </div>
    </AppLayout>
  );
}
