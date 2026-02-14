import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { EngagementPanel } from "@/components/business/EngagementPanel";
import { mockBusiness, mockEngagement } from "@/data/businessMockData";

export default function BusinessEngagement() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />
        <div className="max-w-2xl">
          <EngagementPanel stats={mockEngagement} />
        </div>
      </div>
    </AppLayout>
  );
}
