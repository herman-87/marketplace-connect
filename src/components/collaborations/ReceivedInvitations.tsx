import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import {
  Mail,
  Clock,
  Check,
  X,
  Store,
  Package,
  ClipboardList,
  Search,
  LayoutGrid,
  List,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ReceivedInvitation {
  id: string;
  businessName: string;
  businessDescription: string;
  invitedBy: {
    name: string;
    avatar?: string;
  };
  permissions: string[];
  receivedAt: string;
  status: "pending" | "accepted" | "declined";
}

interface ReceivedInvitationsProps {
  invitations: ReceivedInvitation[];
}

const permissionLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: "Produits", icon: Package },
  orders: { label: "Commandes", icon: ClipboardList },
  marketplace: { label: "Marketplace", icon: Store },
};

const ITEMS_PER_PAGE = 6;

function InvitationCard({ inv, onAccept, onDecline }: { inv: ReceivedInvitation; onAccept: (id: string) => void; onDecline: (id: string) => void }) {
  return (
    <Card className="overflow-hidden hover:bg-muted/30 transition-colors group">
      <div className="h-14 bg-muted/50 relative flex items-center justify-center">
        <Store className="w-5 h-5 text-muted-foreground" />
        <Badge variant="outline" className="absolute top-2 right-2 text-xs gap-1 text-warning border-warning/30 bg-warning/10">
          <Clock className="h-3 w-3" />
          En attente
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground text-base">{inv.businessName}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{inv.businessDescription}</p>
        </div>

        <div className="flex items-center gap-2">
          <UserPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Invité par</span>
          <Avatar className="w-5 h-5">
            <AvatarImage src={inv.invitedBy.avatar} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {inv.invitedBy.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground truncate">{inv.invitedBy.name}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {inv.permissions.map((perm) => {
            const config = permissionLabels[perm];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <Badge key={perm} variant="outline" className="gap-1 text-xs py-0.5 px-2">
                <Icon className="w-3 h-3" />
                {config.label}
              </Badge>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">Reçue {inv.receivedAt}</p>

        <div className="flex justify-center gap-1.5 pt-2 border-t border-border/40">
          <Button size="sm" className="h-7 px-3 text-[11px] gap-1" onClick={() => onAccept(inv.id)}>
            <Check className="h-3 w-3" />
            Accepter
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-3 text-[11px] gap-1 text-destructive hover:text-destructive" onClick={() => onDecline(inv.id)}>
            <X className="h-3 w-3" />
            Refuser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InvitationRow({ inv, onAccept, onDecline, isLast }: { inv: ReceivedInvitation; onAccept: (id: string) => void; onDecline: (id: string) => void; isLast?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 hover:bg-muted/30 transition-colors", !isLast && "border-b border-border/50")}>
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
        <Store className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="font-semibold text-sm truncate">{inv.businessName}</span>
          <Badge variant="outline" className="text-[10px] md:text-xs text-warning border-warning/30 bg-warning/10 shrink-0 hidden sm:flex">
            En attente
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground">par</span>
          <span className="text-xs text-muted-foreground truncate">{inv.invitedBy.name}</span>
        </div>
      </div>
      <div className="flex justify-center gap-1 md:gap-1.5 shrink-0">
        <Button size="sm" className="h-6 text-[10px] px-2 gap-0.5" onClick={() => onAccept(inv.id)}>
          <Check className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">Accepter</span>
        </Button>
        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-0.5 text-destructive hover:text-destructive" onClick={() => onDecline(inv.id)}>
          <X className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">Refuser</span>
        </Button>
      </div>
    </div>
  );
}

export function ReceivedInvitations({ invitations: initialInvitations }: ReceivedInvitationsProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const pendingInvitations = invitations.filter(inv => inv.status === "pending");

  const filtered = pendingInvitations.filter(
    inv => !search || inv.businessName.toLowerCase().includes(search.toLowerCase()) || inv.invitedBy.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAccept = (id: string) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "accepted" as const } : inv));
    toast.success("Invitation acceptée ! Vous êtes maintenant collaborateur.");
  };

  const handleDecline = (id: string) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "declined" as const } : inv));
    toast.info("Invitation refusée.");
  };

  if (pendingInvitations.length === 0 && initialInvitations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Invitations reçues</h3>
          {pendingInvitations.length > 0 && (
            <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
              {pendingInvitations.length}
            </Badge>
          )}
        </div>
      </div>

      {pendingInvitations.length > 0 ? (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une invitation..."
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

          {paginated.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {paginated.map(inv => (
                  <InvitationCard key={inv.id} inv={inv} onAccept={handleAccept} onDecline={handleDecline} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
                {paginated.map((inv, i) => (
                  <InvitationRow key={inv.id} inv={inv} onAccept={handleAccept} onDecline={handleDecline} isLast={i === paginated.length - 1} />
                ))}
              </div>
            )
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Aucun résultat</p>
            </div>
          )}

          <AdaptivePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant={filtered.length > 12 ? "full" : "compact"}
          />
        </>
      ) : (
        <div className="py-6 text-center text-muted-foreground text-sm">
          <Check className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Toutes les invitations ont été traitées</p>
        </div>
      )}
    </div>
  );
}
