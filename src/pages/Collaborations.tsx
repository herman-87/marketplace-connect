import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Users, 
  Package, 
  ClipboardList, 
  Store,
  ArrowRight,
  UserPlus
} from "lucide-react";

const mockCollaborations = [
  {
    id: "3",
    name: "ModeBoutique",
    description: "Collection de vêtements tendance et accessoires de mode pour tous les styles",
    productsCount: 89,
    collaboratorsCount: 5,
    status: "active" as const,
    isOwner: false,
    invitedBy: {
      name: "Sophie Martin",
      avatar: "",
    },
    permissions: ["products", "orders"],
  },
  {
    id: "4",
    name: "GourmetShop",
    description: "Épicerie fine et produits artisanaux de qualité provenant de producteurs locaux",
    productsCount: 45,
    collaboratorsCount: 2,
    status: "active" as const,
    isOwner: false,
    invitedBy: {
      name: "Pierre Durand",
      avatar: "",
    },
    permissions: ["products", "orders", "marketplace"],
  },
];

const permissionLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: "Produits", icon: Package },
  orders: { label: "Commandes", icon: ClipboardList },
  marketplace: { label: "Marketplace", icon: Store },
};

export default function Collaborations() {
  return (
    <AppLayout
      title="Mes Collaborations"
      subtitle="Business où vous êtes collaborateur"
    >
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockCollaborations.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Collaborations actives</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">134</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Produits gérés</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">12</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Commandes en cours</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Collaborations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockCollaborations.map((collab) => (
            <Card 
              key={collab.id}
              className="group overflow-hidden hover:shadow-md transition-all duration-200 border-border/50"
            >
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div className="relative h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
                  <div className="absolute -bottom-6 left-4">
                    <div className="w-14 h-14 rounded-xl bg-card border-2 border-background shadow-md flex items-center justify-center">
                      <Store className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
                  >
                    Collaborateur
                  </Badge>
                </div>

                {/* Content */}
                <div className="pt-10 px-4 pb-4 space-y-4">
                  {/* Business Info */}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {collab.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {collab.description}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span className="font-medium text-foreground">{collab.productsCount}</span>
                      <span className="hidden sm:inline">produits</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-foreground">{collab.collaboratorsCount}</span>
                      <span className="hidden sm:inline">membres</span>
                    </div>
                  </div>

                  {/* Invited By */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                    <UserPlus className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">Invité par</span>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={collab.invitedBy.avatar} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {collab.invitedBy.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground truncate">
                      {collab.invitedBy.name}
                    </span>
                  </div>

                  {/* Permissions */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Vos permissions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.permissions.map((perm) => {
                        const config = permissionLabels[perm];
                        const Icon = config.icon;
                        return (
                          <Badge
                            key={perm}
                            variant="outline"
                            className="gap-1 text-xs py-1 px-2 bg-background"
                          >
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group/btn hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Accéder au business</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockCollaborations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
              Aucune collaboration
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-sm mx-auto">
              Vous n'avez pas encore été invité à collaborer sur un business. Les invitations apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}