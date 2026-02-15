import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, TrendingUp, MoreHorizontal, Search, LayoutGrid, List } from "lucide-react";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
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

const ITEMS_PER_PAGE = 8;

function CollabCardView({ collab, index, isOwner }: { collab: Collaborator; index: number; isOwner: boolean }) {
  return (
    <div className="rounded-lg bg-card border border-border/60 p-4 group hover:border-border transition-colors flex flex-col justify-between min-h-[140px]">
      {/* Top row: avatar + name left, score right */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={collab.avatar} />
            <AvatarFallback className="bg-muted text-foreground text-xs">{collab.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {index < 3 && (
            <span className="absolute -top-1 -left-1 text-xs leading-none">{["🥇", "🥈", "🥉"][index]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm truncate">{collab.name}</span>
            {collab.role === "owner" && <Crown className="h-3.5 w-3.5 text-warning shrink-0" />}
          </div>
          <span className="text-xs text-muted-foreground">Rejoint {collab.joinedAt}</span>
        </div>

        <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium shrink-0">
          <TrendingUp className="h-3 w-3" />
          <span>{collab.activityScore}%</span>
        </div>
      </div>

      {/* Middle: stats + permissions */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {collab.permissions.slice(0, 3).map(perm => (
            <Badge key={perm} variant="secondary" className="text-[10px] px-2 py-0 lowercase">{perm}</Badge>
          ))}
          {collab.permissions.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0 lowercase">+{collab.permissions.length - 3}</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span>{collab.productsCreated} prod.</span>
          <span>{collab.ordersManaged} cmd.</span>
        </div>
      </div>

      {/* Bottom: manage action */}
      {isOwner && collab.role !== "owner" && (
        <div className="mt-3 pt-2.5 border-t border-border/40 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
                <MoreHorizontal className="h-3.5 w-3.5" />
                Gérer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

function CollabListView({ collab, index, isOwner }: { collab: Collaborator; index: number; isOwner: boolean }) {
  return (
    <div className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 hover:bg-muted/30 transition-colors">
      {index < 3 ? (
        <span className="text-sm md:text-base w-6 md:w-7 text-center">{["🥇", "🥈", "🥉"][index]}</span>
      ) : (
        <span className="text-xs md:text-sm text-muted-foreground w-6 md:w-7 text-center font-medium">#{index + 1}</span>
      )}
      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
        <AvatarImage src={collab.avatar} />
        <AvatarFallback className="bg-muted text-foreground text-xs md:text-sm">{collab.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate">{collab.name}</span>
          {collab.role === "owner" && <Crown className="h-3.5 w-3.5 text-warning shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{collab.productsCreated} prod.</span>
          <span className="hidden sm:inline">· {collab.ordersManaged} cmd.</span>
        </div>
      </div>
      <div className="hidden md:flex gap-1 shrink-0">
        {collab.permissions.slice(0, 2).map(perm => (
          <Badge key={perm} variant="secondary" className="text-[10px] px-2 py-0 lowercase">{perm}</Badge>
        ))}
        {collab.permissions.length > 2 && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0 lowercase">+{collab.permissions.length - 2}</Badge>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-sm shrink-0">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold">{collab.activityScore}%</span>
      </div>
      {isOwner && collab.role !== "owner" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 shrink-0">
              <MoreHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function CollaboratorsList({ collaborators, isOwner }: CollaboratorsListProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const sorted = [...collaborators]
    .sort((a, b) => b.activityScore - a.activityScore)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">Collaborateurs</h3>
        <Badge variant="secondary">{collaborators.length}</Badge>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un membre..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 bg-background" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex rounded-md bg-muted p-0.5">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}>
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          {isOwner && (
            <AddEmployeeDialog onAddEmployee={(userId, roles) => console.log("Adding:", userId, roles)} />
          )}
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {paginated.map((c, i) => <CollabCardView key={c.id} collab={c} index={(page - 1) * ITEMS_PER_PAGE + i} isOwner={isOwner} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map((c, i) => <CollabListView key={c.id} collab={c} index={(page - 1) * ITEMS_PER_PAGE + i} isOwner={isOwner} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">Aucun membre trouvé</div>
      )}

      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={sorted.length > 16 ? "full" : "compact"}
      />
    </div>
  );
}
