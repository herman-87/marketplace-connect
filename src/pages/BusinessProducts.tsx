import { AppLayout } from "@/components/layout/AppLayout";
import { ProductsFeed } from "@/components/business/ProductsFeed";
import { mockBusiness, mockProducts } from "@/data/businessMockData";

export default function BusinessProducts() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{mockBusiness.name}</h1>
        <ProductsFeed products={mockProducts} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
