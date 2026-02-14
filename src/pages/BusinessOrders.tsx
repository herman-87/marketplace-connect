import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessOrders as BusinessOrdersComponent } from "@/components/business/BusinessOrders";
import { mockBusiness, mockOrders } from "@/data/businessMockData";

export default function BusinessOrders() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-xl font-semibold">{mockBusiness.name}</h1>
        <BusinessOrdersComponent orders={mockOrders} />
      </div>
    </AppLayout>
  );
}
