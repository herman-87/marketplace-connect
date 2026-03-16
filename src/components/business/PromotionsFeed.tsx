import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Percent,
  MoreHorizontal,
  Plus,
  Search,
  Calendar,
  Zap,
  Clock,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreatePromotionSheet } from "./CreatePromotionSheet";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import { toast } from "sonner";

interface Promotion {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  discountPercent: number;
  discountPrice: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "scheduled";
  createdAt: string;
  createdBy: string;
}

interface PromotionsFeedProps {
  promotions: Promotion[];
  isOwner: boolean;
}

const ITEMS_PER_PAGE = 6;

const statusConfig = {
  active: { label: "Active", variant: "secondary" as const, icon: Zap },
  scheduled: { label: "Planifiée", variant: "secondary" as const, icon: Calendar },
  expired: { label: "Expirée", variant: "outline" as const, icon: AlertCircle },
};

export function PromotionsFeed({ promotions, isOwner }: PromotionsFeedProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handlePromoClick = (promo: Promotion) => {
    setEditPromo(promo);
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete promotion:", id);
    toast.success("Promotion supprimée");
  };

  const filtered = promotions
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p => !search || p.productName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "discount") return b.discountPercent - a.discountPercent;
      if (sortBy === "price") return b.productPrice - a.productPrice;
      if (sortBy === "date") return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    all: promotions.length,
    active: promotions.filter(p => p.status === "active").length,
    scheduled: promotions.filter(p => p.status === "scheduled").length,
    expired: promotions.filter(p => p.status === "expired").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="sticky top-0 z-10 -mx-1 px-1 py-3 bg-background/95 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 md:h-10 bg-card text-sm"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 md:h-10 w-[100px] md:w-[140px] text-xs bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount">Réduction</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="date">Date fin</SelectItem>
            </SelectContent>
          </Select>
          {isOwner && (
            <CreatePromotionSheet
              trigger={
                <Button size="sm" className="h-9 md:h-10 gap-1.5 px-2.5 md:px-4 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Nouvelle promo</span>
                </Button>
              }
            />
          )}
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(["all", "active", "scheduled", "expired"] as const).map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? "activeFilter" : "outline"}
              size="sm"
              className={`h-7 md:h-8 text-xs rounded-full whitespace-nowrap shrink-0 ${statusFilter !== s ? "bg-card" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s === "all" ? "Toutes" : statusConfig[s].label}
              <Badge variant={statusFilter === s ? "outline" : "secondary"} className={`ml-1.5 text-[10px] px-1.5 rounded-full ${statusFilter === s ? "border-background/50 text-background" : ""}`}>
                {counts[s]}
              </Badge>
            </Button>
          ))}
          <div className="flex rounded-md bg-muted p-0.5 ml-auto shrink-0">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}>
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map(promo => {
            const status = statusConfig[promo.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={promo.id}
                className="group rounded-lg bg-card border border-border/60 overflow-hidden cursor-pointer hover:border-foreground transition-colors"
                onClick={() => handlePromoClick(promo)}
              >
                {/* Header: Nom + Status + Menu */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Percent className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{promo.productName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={status.variant} className="gap-1 text-[10px]">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                    {isOwner && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePromoClick(promo)}>Modifier</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(promo.id)}>
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prix: grille 3 colonnes */}
                <div className="px-4 py-3 border-t border-border/40">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Original</p>
                      <p className="text-sm text-muted-foreground line-through">{promo.productPrice.toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Réduction</p>
                      <p className="text-sm font-semibold text-foreground">-{promo.discountPercent}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Prix final</p>
                      <p className="text-sm font-bold text-foreground">{promo.discountPrice.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="px-4 pb-4 pt-2 border-t border-border/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>Du {new Date(promo.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} au {new Date(promo.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    {promo.status === "active" && (() => {
                      const remaining = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${remaining <= 3 ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10"}`}>
                          {remaining > 0 ? `${remaining}j restant${remaining > 1 ? "s" : ""}` : "Expire aujourd'hui"}
                        </span>
                      );
                    })()}
                    {promo.status === "scheduled" && (() => {
                      const daysUntilStart = Math.ceil((new Date(promo.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 text-primary bg-primary/10">
                          {daysUntilStart > 0 ? `Dans ${daysUntilStart}j` : "Aujourd'hui"}
                        </span>
                      );
                    })()}
                    {promo.status === "expired" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 text-muted-foreground bg-muted">
                        Terminée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map(promo => {
              const status = statusConfig[promo.status];
              const StatusIcon = status.icon;
              const remainingBadge = promo.status === "active" ? (() => {
                const remaining = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${remaining <= 3 ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10"}`}>
                    {remaining > 0 ? `${remaining}j restant${remaining > 1 ? "s" : ""}` : "Expire aujourd'hui"}
                  </span>
                );
              })() : promo.status === "scheduled" ? (() => {
                const daysUntilStart = Math.ceil((new Date(promo.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 text-primary bg-primary/10">
                    {daysUntilStart > 0 ? `Dans ${daysUntilStart}j` : "Aujourd'hui"}
                  </span>
                );
              })() : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 text-muted-foreground bg-muted">Terminée</span>
              );

              return (
                <div
                  key={promo.id}
                  className="group flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePromoClick(promo)}
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Percent className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">{promo.productName}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {new Date(promo.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} — {new Date(promo.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">-{promo.discountPercent}%</p>
                      <p className="text-xs text-muted-foreground line-through">{promo.productPrice.toFixed(2)} €</p>
                    </div>
                    {remainingBadge}
                    <Badge variant={status.variant} className="gap-1 text-[10px]">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                    {isOwner && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePromoClick(promo)}>Modifier</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(promo.id)}>Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Aucune promotion trouvée
        </div>
      )}

      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={filtered.length > 12 ? "full" : "compact"}
      />

      {/* Edit Promotion Sheet */}
      <CreatePromotionSheet
        promotion={editPromo}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditPromo(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
