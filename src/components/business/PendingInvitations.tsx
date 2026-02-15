import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Mail, LayoutGrid, List, Search, X } from "lucide-react";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import { Input } from "@/components/ui/input";

interface PendingInvitation {
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

const ITEMS_PER_PAGE = 6;

function InvitationCardView({ inv, onCancel, onResend }: { inv: PendingInvitation; onCancel?: (id: string) => void; onResend?: (id: string) => void }) {
  return (
    <div className="rounded-lg bg-card border border-border/60 p-3.5 group hover:border-border transition-colors">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-11 w-11">
            <AvatarImage src={inv.avatar} />
            <AvatarFallback className="bg-muted text-foreground text-sm">
              {inv.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center">
            <Mail className="h-3 w-3 text-warning" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">{inv.name}</p>
            <Badge variant="outline" className="gap-1 text-[10px] text-warning border-warning/30 bg-warning/10 shrink-0">
              <Clock className="h-3 w-3" />
              En attente
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{inv.email}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {inv.roles.map(role => (
              <Badge key={role} variant="secondary" className="text-[10px] px-2 py-0">{role}</Badge>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground mt-2">
            Invité {inv.invitedAt} par {inv.invitedBy}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/40 flex gap-2">
        <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs" onClick={() => onResend?.(inv.id)}>
          <Mail className="h-3.5 w-3.5 mr-1.5" />
          Relancer
        </Button>
        <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs text-destructive hover:text-destructive" onClick={() => onCancel?.(inv.id)}>
          <X className="h-3.5 w-3.5 mr-1.5" />
          Annuler
        </Button>
      </div>
    </div>
  );
}

function InvitationListView({ inv, onCancel, onResend, isLast }: { inv: PendingInvitation; onCancel?: (id: string) => void; onResend?: (id: string) => void; isLast?: boolean }) {
  return (
    <div className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 hover:bg-muted/30 transition-colors ${!isLast ? "border-b border-border/50" : ""}`}>
      <div className="relative shrink-0">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={inv.avatar} />
          <AvatarFallback className="bg-muted text-foreground text-xs md:text-sm">
            {inv.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center">
          <Mail className="h-2.5 w-2.5 md:h-3 md:w-3 text-warning" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate">{inv.name}</span>
          <Badge variant="outline" className="text-[10px] md:text-xs text-warning border-warning/30 bg-warning/10 shrink-0 hidden sm:flex">
            En attente
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground truncate block">{inv.email}</span>
      </div>
      <div className="hidden md:flex gap-1.5 shrink-0">
        {inv.roles.slice(0, 2).map(role => (
          <Badge key={role} variant="secondary" className="text-xs">{role}</Badge>
        ))}
      </div>
      <div className="flex gap-1 shrink-0">
        <Button size="sm" variant="ghost" className="h-7 md:h-8 text-xs px-2 md:px-3" onClick={() => onResend?.(inv.id)}>
          <Mail className="h-3 w-3 md:mr-1" />
          <span className="hidden md:inline">Relancer</span>
        </Button>
        <Button size="sm" variant="ghost" className="h-7 md:h-8 text-xs px-2 md:px-3 text-destructive" onClick={() => onCancel?.(inv.id)}>
          <X className="h-3 w-3 md:mr-1" />
          <span className="hidden md:inline">Annuler</span>
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

  return (
    <div className="space-y-4">
      {/* Section Header with flow indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Invitations en attente</h3>
          <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
            {invitations.length}
          </Badge>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-warning/10 border border-warning/20">
            <Clock className="h-3.5 w-3.5 text-warning" />
            <span className="text-warning">Invitation envoyée</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary" />
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-primary/10 border border-primary/20">
            <span className="text-primary font-medium">Acceptée → Collaborateur</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(inv => (
              <InvitationCardView key={inv.id} inv={inv} onCancel={onCancel} onResend={onResend} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map((inv, i) => (
              <InvitationListView key={inv.id} inv={inv} onCancel={onCancel} onResend={onResend} isLast={i === paginated.length - 1} />
            ))}
          </div>
        )
      ) : (
        <div className="py-8 text-center text-muted-foreground text-sm">
          <Mail className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Aucune invitation en attente</p>
        </div>
      )}

      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={filtered.length > 12 ? "full" : "compact"}
      />
    </div>
  );
}
