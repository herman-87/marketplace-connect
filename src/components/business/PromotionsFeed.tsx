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
  active: { label: "Active", variant: "default" as const, icon: Zap },
  scheduled: { label: "Planifiée", variant: "secondary" as const, icon: Calendar },
  expired: { label: "Expirée", variant: "outline" as const, icon: AlertCircle },
};

export function PromotionsFeed({ promotions, isOwner }: PromotionsFeedProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [page, setPage] = useState(1);
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
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map(promo => {
            const status = statusConfig[promo.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={promo.id}
                className="group rounded-lg bg-card border border-border/60 overflow-hidden cursor-pointer hover:border-border transition-colors"
                onClick={() => handlePromoClick(promo)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Percent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{promo.productName}</h3>
                        <Badge variant={status.variant} className="gap-1 text-[10px] mt-0.5">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
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

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{promo.discountPrice.toFixed(2)} €</span>
                    <span className="text-sm text-muted-foreground line-through">{promo.productPrice} €</span>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      -{promo.discountPercent}%
                    </span>
                  </div>

                  {/* Dates + jours restants */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(promo.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} → {new Date(promo.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    {promo.status === "active" && (() => {
                      const remaining = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <span className={`text-xs font-medium ${remaining <= 3 ? "text-destructive" : "text-muted-foreground"}`}>
                          {remaining > 0 ? `${remaining} jour${remaining > 1 ? "s" : ""} restant${remaining > 1 ? "s" : ""}` : "Expire aujourd'hui"}
                        </span>
                      );
                    })()}
                    {promo.status === "scheduled" && (() => {
                      const daysUntilStart = Math.ceil((new Date(promo.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <span className="text-xs font-medium text-muted-foreground">
                          Commence dans {daysUntilStart} jour{daysUntilStart > 1 ? "s" : ""}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
