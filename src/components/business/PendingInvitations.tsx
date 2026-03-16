import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Clock,
  X,
  Search,
  LayoutGrid,
  List,
  UserPlus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface PendingInvitation {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  invitedAt: string;
  invitedBy: string;
}

interface PendingInvitationsProps {
  invitations: PendingInvitation[];
  onCancel?: (id: string) => void;
  onResend?: (id: string) => void;
}

const ITEMS_PER_PAGE = 2;

function InvitationCard({ inv, onCancel, onResend }: { inv: PendingInvitation; onCancel?: (id: string) => void; onResend?: (id: string) => void }) {
  return (
    <Card className="overflow-hidden hover:bg-muted/30 transition-colors group">
      <div className="h-14 bg-muted/50 relative flex items-center justify-center">
        <Mail className="w-5 h-5 text-muted-foreground" />
        <Badge variant="outline" className="absolute top-2 right-2 text-xs gap-1 text-warning border-warning/30 bg-warning/10">
          <Clock className="h-3 w-3" />
          En attente
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground text-base">{inv.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{inv.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <UserPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Invité par</span>
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[10px] bg-muted text-foreground">
              {inv.invitedBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground truncate">{inv.invitedBy}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {inv.roles.map((role) => (
            <Badge key={role} variant="outline" className="gap-1 text-xs py-0.5 px-2">
              {role}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">Envoyée {inv.invitedAt}</p>

        <div className="flex gap-2 pt-2 border-t border-border/40">
          <Button size="sm" className="flex-1 h-8 text-xs gap-1.5" onClick={() => onResend?.(inv.id)}>
            <Mail className="h-3.5 w-3.5" />
            Relancer
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 text-destructive hover:text-destructive" onClick={() => onCancel?.(inv.id)}>
            <X className="h-3.5 w-3.5" />
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InvitationRow({ inv, onCancel, onResend, isLast }: { inv: PendingInvitation; onCancel?: (id: string) => void; onResend?: (id: string) => void; isLast?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 hover:bg-muted/30 transition-colors", !isLast && "border-b border-border/50")}>
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
        <Mail className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="font-semibold text-sm truncate">{inv.name}</span>
          <Badge variant="outline" className="text-[10px] md:text-xs text-warning border-warning/30 bg-warning/10 shrink-0 hidden sm:flex">
            En attente
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground">par</span>
          <span className="text-xs text-muted-foreground truncate">{inv.invitedBy}</span>
        </div>
      </div>
      <div className="flex gap-1 md:gap-1.5 shrink-0">
        <Button size="sm" className="h-7 md:h-8 text-xs px-2 md:px-3 gap-1" onClick={() => onResend?.(inv.id)}>
          <Mail className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Relancer</span>
        </Button>
        <Button size="sm" variant="outline" className="h-7 md:h-8 text-xs px-2 md:px-3 gap-1 text-destructive hover:text-destructive" onClick={() => onCancel?.(inv.id)}>
          <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Annuler</span>
        </Button>
      </div>
    </div>
  );
}

export function PendingInvitations({ invitations, onCancel, onResend }: PendingInvitationsProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const filtered = invitations.filter(
    inv => !search || inv.name.toLowerCase().includes(search.toLowerCase()) || inv.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (invitations.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Invitations en attente</h3>
          {invitations.length > 0 && (
            <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
              {invitations.length}
            </Badge>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-warning/10 border border-warning/20">
            <Clock className="h-3.5 w-3.5 text-warning" />
            <span className="text-warning">Invitation envoyée</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-muted border border-border">
            <span className="text-foreground font-medium">Acceptée → Collaborateur</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
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

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {paginated.map(inv => (
              <InvitationCard key={inv.id} inv={inv} onCancel={onCancel} onResend={onResend} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            {paginated.map((inv, i) => (
              <InvitationRow key={inv.id} inv={inv} onCancel={onCancel} onResend={onResend} isLast={i === paginated.length - 1} />
            ))}
          </div>
        )
      ) : (
        <div className="py-8 text-center text-muted-foreground text-sm">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Aucun résultat</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Précédent
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Suivant
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
