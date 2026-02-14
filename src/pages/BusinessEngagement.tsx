import { AppLayout } from "@/components/layout/AppLayout";
import { EngagementPanel } from "@/components/business/EngagementPanel";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessEngagement() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-xl font-semibold">{mockBusiness.name}</h1>
        <EngagementPanel stats={mockEngagement} />
      </div>
    </AppLayout>
  );
}
