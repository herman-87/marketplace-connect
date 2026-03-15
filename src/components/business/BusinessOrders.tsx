import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, Package, Truck, AlertCircle, Search, LayoutGrid, List, CreditCard, PackageCheck, CheckCircle2, Ban, AlertTriangle } from "lucide-react";
import { AdaptivePagination } from "@/components/ui/adaptive-pagination";
import { Order, OrderStatus, ORDER_STATUS_CONFIG } from "@/types/order";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { cn } from "@/lib/utils";

interface BusinessOrdersProps {
  orders: Order[];
}

const ITEMS_PER_PAGE = 6;

const statusFilters: { key: string; label: string; statuses: OrderStatus[] }[] = [
  { key: "all", label: "Toutes", statuses: [] },
  { key: "new", label: "Nouvelles", statuses: ["CREATED"] },
  { key: "active", label: "En cours", statuses: ["ACCEPTED", "PENDING_PAYMENT", "PAID", "PENDING_DELIVERY", "IN_DELIVERY"] },
  { key: "delivered", label: "Livrées", statuses: ["DELIVERED", "COMPLETED"] },
  { key: "issues", label: "Problèmes", statuses: ["REJECTED", "CANCELLED_BY_CLIENT", "PAYMENT_FAILED", "DELIVERY_FAILED", "ACCEPTANCE_TIMEOUT", "DISPUTED"] },
];

const badgeColor: Record<string, string> = {
  success: "bg-green-500/10 text-green-600 border-green-500/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  secondary: "bg-muted text-muted-foreground border-border",
  default: "bg-muted text-foreground border-border",
};

function OrderCardView({ order, onClick }: { order: Order; onClick: () => void }) {
  const config = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="rounded-lg bg-card border border-border/60 p-4 md:p-5 space-y-3 hover:border-border transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={order.customer.avatar} />
            <AvatarFallback className="bg-muted text-foreground text-xs">
              {order.customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{order.customer.name}</p>
            <p className="text-[10px] text-muted-foreground">#{order.id}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-[10px] md:text-xs", badgeColor[config.color])}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-1.5 py-2 border-t border-b border-border/40">
        {order.products.slice(0, 2).map((p, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-muted-foreground truncate mr-2">{p.quantity}x {p.name}</span>
            <span className="font-medium shrink-0">{p.price.toFixed(2)}€</span>
          </div>
        ))}
        {order.products.length > 2 && (
          <p className="text-[10px] text-muted-foreground">+{order.products.length - 2} autre(s)</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </span>
        <span className="font-bold text-base">{order.total.toFixed(2)}€</span>
      </div>

      {order.status === "CREATED" && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-9 gap-1.5 text-xs" onClick={e => e.stopPropagation()}>
            <Check className="h-3.5 w-3.5" />Accepter
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-9 gap-1.5 text-xs text-destructive" onClick={e => e.stopPropagation()}>
            <X className="h-3.5 w-3.5" />Refuser
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderListView({ order, onClick }: { order: Order; onClick: () => void }) {
  const config = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={onClick}>
      <Avatar className="h-9 w-9 md:h-10 md:w-10 shrink-0">
        <AvatarImage src={order.customer.avatar} />
        <AvatarFallback className="bg-muted text-foreground text-xs md:text-sm">
          {order.customer.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="font-semibold text-sm truncate">{order.customer.name}</span>
          <Badge variant="outline" className={cn("text-[10px] md:text-xs shrink-0", badgeColor[config.color])}>
            <span className="hidden sm:inline">{config.label}</span>
            <span className="sm:hidden">{config.label.slice(0, 6)}</span>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {order.products.map(p => `${p.quantity}x ${p.name}`).join(", ")}
        </p>
      </div>
      <span className="hidden sm:inline text-xs text-muted-foreground shrink-0">
        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
      </span>
      <span className="font-bold text-sm md:text-base shrink-0">{order.total.toFixed(2)}€</span>
    </div>
  );
}

export function BusinessOrders({ orders }: BusinessOrdersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        role="business"
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  const activeFilter = statusFilters.find(f => f.key === statusFilter)!;
  const filtered = orders
    .filter(o => statusFilter === "all" || activeFilter.statuses.includes(o.status))
    .filter(o => !search || o.customer.name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Commandes</h3>

      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 bg-background" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {statusFilters.map(f => {
            const count = f.key === "all" ? orders.length : orders.filter(o => f.statuses.includes(o.status)).length;
            return (
              <Button key={f.key} variant={statusFilter === f.key ? "default" : "ghost"} size="sm" className="h-7 md:h-8 text-xs whitespace-nowrap shrink-0" onClick={() => { setStatusFilter(f.key); setPage(1); }}>
                {f.label}
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">{count}</Badge>
              </Button>
            );
          })}
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

      {paginated.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map(o => <OrderCardView key={o.id} order={o} onClick={() => setSelectedOrder(o)} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {paginated.map(o => <OrderListView key={o.id} order={o} onClick={() => setSelectedOrder(o)} />)}
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">Aucune commande trouvée</div>
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
