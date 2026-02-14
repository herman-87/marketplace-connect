import { AppLayout } from "@/components/layout/AppLayout";
import { CollaboratorsList } from "@/components/business/CollaboratorsList";
import { PendingInvitations } from "@/components/business/PendingInvitations";
import { mockBusiness, mockCollaborators, mockPendingInvitations } from "@/data/businessMockData";
import { Separator } from "@/components/ui/separator";

export default function BusinessTeam() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-xl font-semibold">{mockBusiness.name}</h1>
        <div className="space-y-8">
          <PendingInvitations
            invitations={mockPendingInvitations}
            onCancel={(id) => console.log("Cancel invitation:", id)}
            onResend={(id) => console.log("Resend invitation:", id)}
          />
          <Separator />
          <CollaboratorsList collaborators={mockCollaborators} isOwner={mockBusiness.isOwner} />
        </div>
      </div>
    </AppLayout>
  );
}
