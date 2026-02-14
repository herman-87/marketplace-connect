import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { CollaboratorsList } from "@/components/business/CollaboratorsList";
import { ClientsList } from "@/components/business/ClientsList";
import { mockBusiness, mockCollaborators, mockClients } from "@/data/businessMockData";

export default function BusinessTeam() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <BusinessHeader business={mockBusiness} />
        <div className="space-y-6">
          <CollaboratorsList collaborators={mockCollaborators} isOwner={mockBusiness.isOwner} />
          <ClientsList clients={mockClients} />
        </div>
      </div>
    </AppLayout>
  );
}
