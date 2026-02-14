import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, TrendingUp, MoreHorizontal, Search, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
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
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  isOwner: boolean;
}

const ITEMS_PER_PAGE = 8;

function CollabCardView({ collab, index, isOwner }: { collab: Collaborator; index: number; isOwner: boolean }) {
  return (
    <div className="rounded-lg bg-card border border-border/60 p-4 flex flex-col items-center text-center relative group hover:border-border transition-colors">
      {index < 3 && (
        <span className="absolute top-2 left-2 text-sm">{["🥇", "🥈", "🥉"][index]}</span>
      )}
      {isOwner && collab.role !== "owner" && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier les permissions</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Retirer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Avatar className="h-14 w-14">
        <AvatarImage src={collab.avatar} />
        <AvatarFallback className="bg-muted text-foreground">{collab.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="mt-2 flex items-center gap-1">
        <span className="font-medium text-sm truncate max-w-[100px]">{collab.name}</span>
        {collab.role === "owner" && <Crown className="h-3.5 w-3.5 text-warning shrink-0" />}
      </div>
      <span className="text-[10px] text-muted-foreground">{collab.joinedAt}</span>
      <div className="mt-3 grid grid-cols-2 gap-2 w-full text-center">
        <div className="p-1.5 bg-muted/50 rounded">
          <p className="text-sm font-semibold">{collab.productsCreated}</p>
          <p className="text-[10px] text-muted-foreground">Produits</p>
        </div>
        <div className="p-1.5 bg-muted/50 rounded">
          <p className="text-sm font-semibold">{collab.ordersManaged}</p>
          <p className="text-[10px] text-muted-foreground">Commandes</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="font-medium">{collab.activityScore}%</span>
      </div>
    </div>
  );
}

function CollabListView({ collab, index, isOwner }: { collab: Collaborator; index: number; isOwner: boolean }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-border/40 hover:bg-muted/30 transition-all">
      {index < 3 ? (
        <span className="text-sm w-6 text-center">{["🥇", "🥈", "🥉"][index]}</span>
      ) : (
        <span className="text-xs text-muted-foreground w-6 text-center">#{index + 1}</span>
      )}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={collab.avatar} />
        <AvatarFallback className="bg-muted text-foreground text-[10px]">{collab.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">{collab.name}</span>
          {collab.role === "owner" && <Crown className="h-3 w-3 text-warning shrink-0" />}
        </div>
        <span className="text-[10px] text-muted-foreground">{collab.joinedAt}</span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{collab.productsCreated} produits</span>
      <span className="text-xs text-muted-foreground shrink-0">{collab.ordersManaged} commandes</span>
      <div className="flex items-center gap-1 text-xs shrink-0">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="font-medium">{collab.activityScore}%</span>
      </div>
      {isOwner && collab.role !== "owner" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {paginated.map((c, i) => <CollabCardView key={c.id} collab={c} index={(page - 1) * ITEMS_PER_PAGE + i} isOwner={isOwner} />)}
          </div>
        ) : (
          <div className="space-y-1">
            {paginated.map((c, i) => <CollabListView key={c.id} collab={c} index={(page - 1) * ITEMS_PER_PAGE + i} isOwner={isOwner} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">Aucun membre trouvé</div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
