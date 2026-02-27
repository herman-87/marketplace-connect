import { AppLayout } from "@/components/layout/AppLayout";
import { CollaboratorsList } from "@/components/business/CollaboratorsList";
import { PendingInvitations } from "@/components/business/PendingInvitations";
import { BusinessMobileNav } from "@/components/business/BusinessMobileNav";
import { mockBusiness, mockCollaborators, mockPendingInvitations } from "@/data/businessMockData";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, TrendingUp } from "lucide-react";

export default function BusinessTeam() {
  const activeCollabs = mockCollaborators.filter(c => c.role !== "owner").length;
  const pendingCount = mockPendingInvitations.length;
  const avgScore = Math.round(mockCollaborators.reduce((sum, c) => sum + c.activityScore, 0) / mockCollaborators.length);

  return (
    <AppLayout title={mockBusiness.name} subtitle="Gérez votre équipe et les invitations">
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <BusinessMobileNav />

        {/* Invitations en attente - même style que /collaborations */}
        <section className="p-4 md:p-5 rounded-xl bg-muted/20 border border-border/40">
          <PendingInvitations
            invitations={mockPendingInvitations}
            onCancel={(id) => console.log("Cancel invitation:", id)}
            onResend={(id) => console.log("Resend invitation:", id)}
          />
        </section>

        {/* Stats résumé - même pattern que /collaborations */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm md:text-base text-foreground">
              {mockCollaborators.length} membre{mockCollaborators.length > 1 ? "s" : ""} dans l'équipe
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {activeCollabs} collaborateur{activeCollabs > 1 ? "s" : ""} actif{activeCollabs > 1 ? "s" : ""} · {pendingCount} invitation{pendingCount > 1 ? "s" : ""} en attente
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">{mockCollaborators.length}</span>
              <span className="hidden sm:inline">membres</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mail className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">{pendingCount}</span>
              <span className="hidden sm:inline">en attente</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">{avgScore}%</span>
              <span className="hidden sm:inline">activité moy.</span>
            </div>
          </div>
        </div>

        {/* Liste des collaborateurs */}
        <CollaboratorsList collaborators={mockCollaborators} isOwner={mockBusiness.isOwner} />
      </div>
    </AppLayout>
  );
}
