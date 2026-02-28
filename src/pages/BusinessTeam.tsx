import { AppLayout } from "@/components/layout/AppLayout";
import { CollaboratorsList } from "@/components/business/CollaboratorsList";
import { PendingInvitations } from "@/components/business/PendingInvitations";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockCollaborators, mockPendingInvitations } from "@/data/businessMockData";

export default function BusinessTeam() {
  return (
    <AppLayout title={mockBusiness.name} subtitle="Gérez votre équipe et les invitations">
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <BusinessMobileNav />

        {/* Invitations en attente — même container que /collaborations */}
        <section className="p-4 md:p-5 rounded-xl bg-muted/20 border border-border/40">
          <PendingInvitations
            invitations={mockPendingInvitations}
            onCancel={(id) => console.log("Cancel invitation:", id)}
            onResend={(id) => console.log("Resend invitation:", id)}
          />
        </section>

        {/* Liste des collaborateurs — même structure que /collaborations */}
        <CollaboratorsList collaborators={mockCollaborators} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
