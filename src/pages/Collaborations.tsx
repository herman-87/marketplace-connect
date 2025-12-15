import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Shield, Package, ClipboardList } from "lucide-react";

const mockCollaborations = [
  {
    name: "ModeBoutique",
    description: "Collection de vêtements tendance et accessoires de mode pour tous les styles",
    productsCount: 89,
    collaboratorsCount: 5,
    status: "active" as const,
    isOwner: false,
    invitedBy: "Sophie Martin",
    permissions: ["products", "orders"],
  },
  {
    name: "GourmetShop",
    description: "Épicerie fine et produits artisanaux de qualité provenant de producteurs locaux",
    productsCount: 45,
    collaboratorsCount: 2,
    status: "active" as const,
    isOwner: false,
    invitedBy: "Pierre Durand",
    permissions: ["products", "orders", "marketplace"],
  },
];

const permissionLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: "Produits", icon: Package },
  orders: { label: "Commandes", icon: ClipboardList },
  marketplace: { label: "Marketplace", icon: Shield },
};

export default function Collaborations() {
  return (
    <AppLayout
      title="Mes Collaborations"
      subtitle="Business où vous êtes collaborateur"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-collab flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockCollaborations.length}</p>
              <p className="text-sm text-muted-foreground">Collaborations actives</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">134</p>
              <p className="text-sm text-muted-foreground">Produits gérés</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Commandes en cours</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une collaboration..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Collaborations List */}
        <div className="space-y-4">
          {mockCollaborations.map((collab) => (
            <div
              key={collab.name}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Business Card Preview */}
                <div className="lg:w-80 shrink-0">
                  <BusinessCard {...collab} />
                </div>

                {/* Details */}
                <div className="flex-1 p-6 border-t lg:border-t-0 lg:border-l border-border">
                  <div className="space-y-4">
                    {/* Invited By */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Invité par</p>
                      <p className="font-medium text-foreground">{collab.invitedBy}</p>
                    </div>

                    {/* Permissions */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Vos permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {collab.permissions.map((perm) => {
                          const config = permissionLabels[perm];
                          const Icon = config.icon;
                          return (
                            <Badge
                              key={perm}
                              variant="secondary"
                              className="gap-1.5"
                            >
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Voir les produits
                      </Button>
                      <Button variant="outline" size="sm">
                        Voir les commandes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no collaborations) */}
        {mockCollaborations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune collaboration
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Vous n'avez pas encore été invité à collaborer sur un business. Les invitations apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
