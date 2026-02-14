import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { ProductsFeed } from "@/components/business/ProductsFeed";
import { mockBusiness, mockProducts } from "@/data/businessMockData";

export default function BusinessProducts() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />
        <ProductsFeed products={mockProducts} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
