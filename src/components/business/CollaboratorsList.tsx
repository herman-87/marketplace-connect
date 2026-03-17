import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import {
  Crown,
  TrendingUp,
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  UserCheck,
  UserPlus,
  Package,
  ClipboardList,
  Store,
  Users,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "collaborator";
  activityScore: number;
  productsCreated: number;
  ordersManaged: number;
  joinedAt: string;
  permissions: string[];
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  isOwner: boolean;
}

const permissionLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: "Produits", icon: Package },
  orders: { label: "Commandes", icon: ClipboardList },
  marketplace: { label: "Marketplace", icon: Store },
};

const ITEMS_PER_PAGE = 6;

function CollabCardView({ collab, isOwner }: { collab: Collaborator; isOwner: boolean }) {
  return (
    <Card className="overflow-hidden hover:border-foreground/30 transition-colors group">
      {/* Header — identique à /collaborations */}
      <div className="h-16 bg-muted/50 relative flex items-center justify-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={collab.avatar} />
        <AvatarFallback className="text-xs bg-muted text-foreground">
          {collab.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Status Badge */}
        {collab.role === "owner" ? (
          <Badge
            variant="outline"
            className="absolute top-2 right-10 text-xs gap-1 text-warning border-warning/30 bg-warning/10"
          >
            <Crown className="h-3 w-3" />
            Propriétaire
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="absolute top-2 right-10 text-xs gap-1 bg-success/10 text-success border-success/30"
          >
            <UserCheck className="h-3 w-3" />
            Actif
          </Badge>
        )}

        {/* Menu — identique à /collaborations */}
        {isOwner && collab.role !== "owner" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 hover:bg-background/50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Retirer de l'équipe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title & Role — identique à /collaborations */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
            {collab.name}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0">
            {collab.role === "owner" ? "Propriétaire" : "Collaborateur"}
          </Badge>
        </div>

        {/* Description / Joined */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          Rejoint {collab.joinedAt} · Activité {collab.activityScore}%
        </p>

        {/* Permissions — identique à /collaborations */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {collab.role === "owner" ? (
            <Badge variant="outline" className="gap-1 text-xs py-0.5 px-2">
              accès complet
            </Badge>
          ) : (
            collab.permissions.map((perm) => {
              const config = permissionLabels[perm];
              if (!config) {
                return (
                  <Badge key={perm} variant="outline" className="gap-1 text-xs py-0.5 px-2 lowercase">
                    {perm}
                  </Badge>
                );
              }
              const Icon = config.icon;
              return (
                <Badge key={perm} variant="outline" className="gap-1 text-xs py-0.5 px-2">
                  <Icon className="w-3 h-3" />
                  {config.label}
                </Badge>
              );
            })
          )}
        </div>

        {/* Stats Row — identique à /collaborations */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{collab.productsCreated}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <span>{collab.ordersManaged}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>{collab.activityScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CollabListView({ collab, isOwner, isLast }: { collab: Collaborator; isOwner: boolean; isLast?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 hover:bg-muted/30 transition-colors", !isLast && "border-b border-border/50")}>
      <Avatar className="h-9 w-9 md:h-10 md:w-10 shrink-0">
        <AvatarImage src={collab.avatar} />
        <AvatarFallback className="text-xs bg-muted text-foreground">
          {collab.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="font-semibold text-sm truncate">{collab.name}</span>
          {collab.role === "owner" ? (
            <Badge variant="outline" className="text-[10px] md:text-xs text-warning border-warning/30 bg-warning/10 shrink-0 hidden sm:flex gap-1">
              <Crown className="h-3 w-3" />
              Propriétaire
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] md:text-xs bg-success/10 text-success border-success/30 shrink-0 hidden sm:flex gap-1">
              <UserCheck className="h-3 w-3" />
              Actif
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground">Rejoint {collab.joinedAt}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">· {collab.activityScore}% activité</span>
        </div>
      </div>
      <div className="hidden md:flex gap-1 shrink-0">
        {collab.role === "owner" ? (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5">accès complet</Badge>
        ) : (
          collab.permissions.slice(0, 2).map((perm) => {
            const config = permissionLabels[perm];
            if (!config) return <Badge key={perm} variant="outline" className="text-[10px] px-2 py-0.5 lowercase">{perm}</Badge>;
            const Icon = config.icon;
            return (
              <Badge key={perm} variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
              </Badge>
            );
          })
        )}
      </div>
      {isOwner && collab.role !== "owner" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 shrink-0">
              <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Retirer de l'équipe</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function CollaboratorsList({ collaborators, isOwner }: CollaboratorsListProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const INITIAL_VISIBLE = 2;
  const [showAll, setShowAll] = useState(false);

  const sorted = [...collaborators]
    .sort((a, b) => b.activityScore - a.activityScore)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const displayed = showAll ? paginated : paginated.slice(0, INITIAL_VISIBLE);
  const hasMore = paginated.length > INITIAL_VISIBLE && !showAll;

  return (
    <div className="space-y-4">
      {/* Section Header — identique à ReceivedInvitations */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Collaborateurs</h3>
          <Badge variant="outline" className="text-foreground border-border bg-muted">
            {collaborators.length}
          </Badge>
        </div>
        {isOwner && (
          <AddEmployeeDialog onAddEmployee={(userId, roles) => console.log("Adding:", userId, roles)} />
        )}
      </div>

      {/* Toolbar — identique à ReceivedInvitations */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 bg-background"
          />
        </div>
        <div className="flex rounded-md bg-muted p-0.5 ml-auto">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}>
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content — identique à /collaborations grid */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {displayed.map(c => <CollabCardView key={c.id} collab={c} isOwner={isOwner} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            {displayed.map((c, i) => <CollabListView key={c.id} collab={c} isOwner={isOwner} isLast={i === displayed.length - 1} />)}
          </div>
        )
      ) : (
        <div className="py-8 text-center text-muted-foreground text-sm">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Aucun membre trouvé</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowAll(true)}
          >
            {t("collaborations.seeMore")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={sorted.length > 12 ? "full" : "compact"}
      />
    </div>
  );
}
