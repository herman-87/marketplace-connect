import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, Package, Truck, AlertCircle, Search, LayoutGrid, List } from "lucide-react";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";

interface Order {
  id: string;
  customer: { name: string; avatar?: string };
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  createdAt: string;
  rejectionReason?: string;
}

interface BusinessOrdersProps {
  orders: Order[];
}

const ITEMS_PER_PAGE = 6;

const statusConfig = {
  pending: { label: "En attente", variant: "outline" as const, icon: Clock },
  accepted: { label: "Acceptée", variant: "default" as const, icon: Package },
  rejected: { label: "Refusée", variant: "destructive" as const, icon: AlertCircle },
  delivered: { label: "Livrée", variant: "secondary" as const, icon: Truck },
};

function OrderCardView({ order }: { order: Order }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-lg bg-card border border-border/60 p-5 space-y-4 hover:border-border transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={order.customer.avatar} />
            <AvatarFallback className="bg-muted text-foreground text-sm">
              {order.customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base">{order.customer.name}</p>
            <p className="text-xs text-muted-foreground">#{order.id}</p>
          </div>
        </div>
        <Badge variant={status.variant} className="gap-1.5 text-xs">
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </Badge>
      </div>

      <div className="space-y-2 py-2 border-t border-b border-border/40">
        {order.products.map((p, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{p.quantity}x {p.name}</span>
            <span className="font-medium">{p.price}€</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{order.createdAt}</span>
        <span className="font-bold text-lg">{order.total}€</span>
      </div>

      {order.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-9 gap-1.5 text-xs"><Check className="h-3.5 w-3.5" />Accepter</Button>
          <Button size="sm" variant="outline" className="flex-1 h-9 gap-1.5 text-xs text-destructive"><X className="h-3.5 w-3.5" />Refuser</Button>
        </div>
      )}
      {order.status === "accepted" && (
        <Button size="sm" variant="outline" className="w-full h-9 gap-1.5 text-xs"><Truck className="h-3.5 w-3.5" />Marquer livrée</Button>
      )}
    </div>
  );
}

function OrderListView({ order }: { order: Order }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 hover:bg-muted/30 transition-colors">
      <Avatar className="h-9 w-9 md:h-10 md:w-10 shrink-0">
        <AvatarImage src={order.customer.avatar} />
        <AvatarFallback className="bg-muted text-foreground text-xs md:text-sm">
          {order.customer.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="font-semibold text-sm truncate">{order.customer.name}</span>
          <Badge variant={status.variant} className="gap-1 text-[10px] md:text-xs shrink-0">
            <StatusIcon className="h-3 w-3" />
            <span className="hidden sm:inline">{status.label}</span>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {order.products.map(p => `${p.quantity}x ${p.name}`).join(", ")}
        </p>
      </div>
      <span className="hidden sm:inline text-xs text-muted-foreground shrink-0">{order.createdAt}</span>
      <span className="font-bold text-sm md:text-base shrink-0">{order.total}€</span>
      {order.status === "pending" && (
        <div className="flex gap-1 shrink-0">
          <Button size="icon" className="h-7 w-7 md:h-8 md:w-8"><Check className="h-3 w-3 md:h-3.5 md:w-3.5" /></Button>
          <Button size="icon" variant="outline" className="h-7 w-7 md:h-8 md:w-8 text-destructive"><X className="h-3 w-3 md:h-3.5 md:w-3.5" /></Button>
        </div>
      )}
    </div>
  );
}

export function BusinessOrders({ orders }: BusinessOrdersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const filtered = orders
    .filter(o => statusFilter === "all" || o.status === statusFilter)
    .filter(o => !search || o.customer.name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    accepted: orders.filter(o => o.status === "accepted").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    rejected: orders.filter(o => o.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <h3 className="text-lg font-semibold">Commandes</h3>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 bg-background" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(["all", "pending", "accepted", "delivered", "rejected"] as const).map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "ghost"} size="sm" className="h-7 md:h-8 text-xs whitespace-nowrap shrink-0" onClick={() => { setStatusFilter(s); setPage(1); }}>
              {s === "all" ? "Toutes" : s === "pending" ? "Attente" : s === "accepted" ? "Acceptées" : s === "delivered" ? "Livrées" : "Refusées"}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">{counts[s]}</Badge>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map(o => <OrderCardView key={o.id} order={o} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map(o => <OrderListView key={o.id} order={o} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">Aucune commande trouvée</div>
      )}

      {/* Pagination */}
      <AdaptivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant={filtered.length > 12 ? "full" : "compact"}
      />
    </div>
  );
}
