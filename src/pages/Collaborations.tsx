import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Users, 
  Package, 
  ClipboardList, 
  Store,
  ArrowRight,
  UserPlus,
  MoreVertical,
  ExternalLink,
  LayoutGrid,
  List,
  Mail,
} from "lucide-react";
import { ReceivedInvitations, ReceivedInvitation } from "@/components/collaborations/ReceivedInvitations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCollaborations = [
  {
    id: "3",
    name: "ModeBoutique",
    description: "Collection de vêtements tendance et accessoires de mode pour tous les styles",
    productsCount: 89,
    collaboratorsCount: 5,
    status: "active" as const,
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
    invitedBy: {
      name: "Pierre Durand",
      avatar: "",
    },
    permissions: ["products", "orders", "marketplace"],
  },
];

const mockReceivedInvitations: ReceivedInvitation[] = [
  {
    id: "inv-1",
    businessName: "SportZone Pro",
    businessDescription: "Articles de sport et équipements fitness pour tous niveaux",
    invitedBy: { name: "Lucas Bernard", avatar: "" },
    permissions: ["products", "orders"],
    receivedAt: "il y a 2 heures",
    status: "pending",
  },
  {
    id: "inv-2",
    businessName: "ElectroHub",
    businessDescription: "Matériel électronique et accessoires high-tech à prix compétitifs",
    invitedBy: { name: "Emma Lefèvre", avatar: "" },
    permissions: ["products", "orders", "marketplace"],
    receivedAt: "il y a 1 jour",
    status: "pending",
  },
  {
    id: "inv-3",
    businessName: "DécoMaison",
    businessDescription: "Décoration intérieure et mobilier design pour tous les espaces",
    invitedBy: { name: "Claire Moreau", avatar: "" },
    permissions: ["products"],
    receivedAt: "il y a 3 jours",
    status: "pending",
  },
];

const permissionLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: "Produits", icon: Package },
  orders: { label: "Commandes", icon: ClipboardList },
  marketplace: { label: "Marketplace", icon: Store },
};

export default function Collaborations() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  return (
    <AppLayout
      title="Mes Collaborations"
      subtitle="Business où vous êtes collaborateur"
    >
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        {/* Invitations reçues */}
        <section className="p-4 md:p-5 rounded-xl bg-muted/20 border border-border/40">
          <ReceivedInvitations invitations={mockReceivedInvitations} />
        </section>

        {/* Header Actions - Collaborations actives */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 md:h-8 md:w-8",
                  viewMode === "grid" && "bg-muted"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 md:h-8 md:w-8",
                  viewMode === "list" && "bg-muted"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Info */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm md:text-base text-foreground">
              {mockCollaborations.length} collaboration{mockCollaborations.length > 1 ? "s" : ""} active{mockCollaborations.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Vous gérez un total de 134 produits en tant que collaborateur
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">134</span>
              <span className="hidden sm:inline">produits</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClipboardList className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">12</span>
              <span className="hidden sm:inline">commandes</span>
            </div>
          </div>
        </div>

        {/* Collaborations Grid */}
        <div
          className={cn(
            "grid gap-3 md:gap-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {mockCollaborations.map((collab) => (
            <Link key={collab.id} to={`/business/${collab.id}`} className="block group">
              <Card className="overflow-hidden hover:border-foreground transition-colors">
                {/* Header */}
                <div className="h-16 bg-muted/50 relative flex items-center justify-center">
                  <Store className="w-6 h-6 text-muted-foreground" />
                  
                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className="absolute top-2 right-10 text-xs bg-success/10 text-success border-success/30"
                  >
                    Actif
                  </Badge>

                  {/* Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-8 w-8 hover:bg-background/50"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir sur le marketplace
                      </DropdownMenuItem>
                      <DropdownMenuItem>Gérer les produits</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Quitter la collaboration
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="p-4">
                  {/* Title & Role */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground transition-colors">
                      {collab.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Collaborateur
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {collab.description}
                  </p>

                  {/* Invited By */}
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">Invité par</span>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={collab.invitedBy.avatar} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {collab.invitedBy.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground truncate">
                      {collab.invitedBy.name}
                    </span>
                  </div>

                  {/* Permissions */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {collab.permissions.map((perm) => {
                      const config = permissionLabels[perm];
                      const Icon = config.icon;
                      return (
                        <Badge
                          key={perm}
                          variant="outline"
                          className="gap-1 text-xs py-0.5 px-2"
                        >
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-primary/70" />
                      <span>{collab.productsCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary/70" />
                      <span>{collab.collaboratorsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
