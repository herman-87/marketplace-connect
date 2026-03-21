import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag, PackageCheck, Truck, Clock, Search, LayoutGrid, List,
  Package, Star, ChevronRight, CheckCircle2, CreditCard, AlertTriangle,
  Ban, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus, ORDER_STATUS_CONFIG } from "@/types/order";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { PaginationControls } from "@/components/marketplace/PaginationControls";

const mockPurchases: Order[] = [
  {
    id: "ACH-001", customer: { name: "Vous" },
    products: [
      { name: "Burger Deluxe Menu", quantity: 2, price: 25.80, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop" },
      { name: "Frites Maison", quantity: 1, price: 5.50, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=80&h=80&fit=crop" },
      { name: "Coca-Cola", quantity: 2, price: 3.00 },
    ],
    total: 63.10, status: "IN_DELIVERY", createdAt: "2025-02-15T14:30:00Z",
    deliveryAddress: "12 Rue de la Liberté, Dakar", deliveryMethod: "express",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-02-15T14:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-02-15T14:05:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-02-15T14:05:00Z" },
      { status: "PAID", timestamp: "2025-02-15T14:10:00Z", note: "Paiement Mobile Money" },
      { status: "PENDING_DELIVERY", timestamp: "2025-02-15T14:20:00Z" },
      { status: "IN_DELIVERY", timestamp: "2025-02-15T14:30:00Z", note: "Livreur: Abdou D." },
    ],
  },
  {
    id: "ACH-002", customer: { name: "Vous" },
    products: [{ name: "Écouteurs Bluetooth Pro", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" }],
    total: 79.99, status: "DELIVERED", createdAt: "2025-02-14T10:15:00Z",
    deliveryAddress: "45 Avenue Bourguiba, Dakar", deliveryMethod: "standard",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-02-14T10:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-02-14T10:10:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-02-14T10:10:00Z" },
      { status: "PAID", timestamp: "2025-02-14T10:15:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2025-02-14T12:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2025-02-14T14:00:00Z" },
      { status: "DELIVERED", timestamp: "2025-02-14T16:00:00Z", note: "Livré à l'adresse" },
    ],
  },
  {
    id: "ACH-003", customer: { name: "Vous" },
    products: [
      { name: "T-shirt Premium", quantity: 2, price: 69.98, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop" },
      { name: "Jean Slim", quantity: 1, price: 49.99 },
      { name: "Ceinture Cuir", quantity: 1, price: 25.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop" },
    ],
    total: 144.97, status: "COMPLETED", createdAt: "2025-01-12T16:45:00Z",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-01-12T16:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-01-12T16:15:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-01-12T16:15:00Z" },
      { status: "PAID", timestamp: "2025-01-12T16:30:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2025-01-12T18:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2025-01-13T08:00:00Z" },
      { status: "DELIVERED", timestamp: "2025-01-13T12:00:00Z" },
      { status: "COMPLETED", timestamp: "2025-01-13T14:00:00Z", note: "Réception confirmée" },
    ],
  },
  {
    id: "ACH-004", customer: { name: "Vous" },
    products: [
      { name: "Poulet Yassa", quantity: 1, price: 15.90, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=80&h=80&fit=crop" },
      { name: "Riz au Poisson", quantity: 1, price: 12.50 },
    ],
    total: 28.40, status: "PENDING_PAYMENT", createdAt: "2025-02-15T12:00:00Z",
    deliveryAddress: "8 Rue Faidherbe, Dakar", deliveryMethod: "standard",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-02-15T12:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-02-15T12:10:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-02-15T12:10:00Z", note: "En attente de paiement" },
    ],
  },
  {
    id: "ACH-005", customer: { name: "Vous" },
    products: [{ name: "Chaussures Running", quantity: 1, price: 95.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop" }],
    total: 95.00, status: "COMPLETED", createdAt: "2025-01-05T09:00:00Z",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-01-05T09:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-01-05T09:15:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-01-05T09:15:00Z" },
      { status: "PAID", timestamp: "2025-01-05T09:30:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2025-01-05T12:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2025-01-06T08:00:00Z" },
      { status: "DELIVERED", timestamp: "2025-01-06T14:00:00Z" },
      { status: "COMPLETED", timestamp: "2025-01-06T16:00:00Z" },
    ],
  },
  {
    id: "ACH-006", customer: { name: "Vous" },
    products: [{ name: "Lampe de bureau LED", quantity: 1, price: 42.50, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=80&h=80&fit=crop" }],
    total: 42.50, status: "DELIVERED", createdAt: "2025-02-10T11:00:00Z",
    deliveryAddress: "22 Rue de Thiès, Dakar", deliveryMethod: "standard",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-02-10T11:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-02-10T11:30:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-02-10T11:30:00Z" },
      { status: "PAID", timestamp: "2025-02-10T12:00:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2025-02-10T14:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2025-02-11T08:00:00Z" },
      { status: "DELIVERED", timestamp: "2025-02-11T12:00:00Z" },
    ],
  },
  {
    id: "ACH-007", customer: { name: "Vous" },
    products: [
      { name: "Sac bandoulière cuir", quantity: 1, price: 65.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop" },
      { name: "Portefeuille assorti", quantity: 1, price: 35.00 },
    ],
    total: 100.00, status: "COMPLETED", createdAt: "2024-12-20T15:00:00Z",
    statusHistory: [
      { status: "CREATED", timestamp: "2024-12-20T15:00:00Z" },
      { status: "ACCEPTED", timestamp: "2024-12-20T15:30:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2024-12-20T15:30:00Z" },
      { status: "PAID", timestamp: "2024-12-20T16:00:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2024-12-21T08:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2024-12-21T10:00:00Z" },
      { status: "DELIVERED", timestamp: "2024-12-21T14:00:00Z" },
      { status: "COMPLETED", timestamp: "2024-12-21T16:00:00Z" },
    ],
  },
  {
    id: "ACH-008", customer: { name: "Vous" },
    products: [{ name: "Clavier Mécanique", quantity: 1, price: 119.99, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop" }],
    total: 119.99, status: "COMPLETED", createdAt: "2024-12-15T10:00:00Z",
    statusHistory: [
      { status: "CREATED", timestamp: "2024-12-15T10:00:00Z" },
      { status: "ACCEPTED", timestamp: "2024-12-15T10:30:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2024-12-15T10:30:00Z" },
      { status: "PAID", timestamp: "2024-12-15T11:00:00Z" },
      { status: "PENDING_DELIVERY", timestamp: "2024-12-15T14:00:00Z" },
      { status: "IN_DELIVERY", timestamp: "2024-12-16T08:00:00Z" },
      { status: "DELIVERED", timestamp: "2024-12-16T12:00:00Z" },
      { status: "COMPLETED", timestamp: "2024-12-16T14:00:00Z" },
    ],
  },
];

const businessNames: Record<string, string> = {
  "ACH-001": "RestauFast",
  "ACH-002": "TechStore",
  "ACH-003": "ModeBoutique",
  "ACH-004": "Saveurs d'Afrique",
  "ACH-005": "SportZone",
  "ACH-006": "MaisonDeco",
  "ACH-007": "ModeBoutique",
  "ACH-008": "TechStore",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock, CheckCircle2, Truck, PackageCheck, CreditCard, AlertTriangle, Ban, AlertCircle, Package,
};

const statusBadgeStyles: Record<string, string> = {
  success: "bg-green-500/10 text-green-600 border-green-500/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  secondary: "bg-muted text-muted-foreground border-border",
  default: "bg-primary/10 text-primary border-primary/20",
};

type TabFilter = "all" | "active" | "delivered" | "completed" | "pending";

const ITEMS_PER_PAGE = 6;

const activeStatuses: OrderStatus[] = ["CREATED", "ACCEPTED", "PENDING_PAYMENT", "PAID", "PENDING_DELIVERY", "IN_DELIVERY"];

export default function MesAchats() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  if (selectedOrder) {
    return (
      <AppLayout title="Mes Achats" subtitle="Détail de la commande">
        <div className="animate-fade-in">
          <OrderDetailView order={selectedOrder} role="client" onBack={() => setSelectedOrder(null)} />
        </div>
      </AppLayout>
    );
  }

  const tabFiltered = mockPurchases.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return activeStatuses.includes(p.status);
    if (activeTab === "delivered") return p.status === "DELIVERED";
    if (activeTab === "completed") return p.status === "COMPLETED";
    if (activeTab === "pending") return p.status === "PENDING_PAYMENT";
    return true;
  });

  const filtered = tabFiltered
    .filter((p) => {
      const bName = businessNames[p.id] || "";
      const pNames = p.products.map((pr) => pr.name).join(" ");
      const q = searchQuery.toLowerCase();
      return p.id.toLowerCase().includes(q) || bName.toLowerCase().includes(q) || pNames.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "price-asc") return a.total - b.total;
      if (sortBy === "price-desc") return b.total - a.total;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const activeCount = mockPurchases.filter((p) => activeStatuses.includes(p.status)).length;
  const deliveredCount = mockPurchases.filter((p) => p.status === "DELIVERED").length;
  const completedCount = mockPurchases.filter((p) => p.status === "COMPLETED").length;
  const pendingCount = mockPurchases.filter((p) => p.status === "PENDING_PAYMENT").length;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabFilter);
    setCurrentPage(1);
  };

  const renderPurchaseCard = (purchase: Order) => {
    const config = ORDER_STATUS_CONFIG[purchase.status];
    const StatusIcon = iconMap[config.icon] || Clock;
    const businessName = businessNames[purchase.id] || "Boutique";
    const productCount = purchase.products.length;

    if (viewMode === "grid") {
      return (
        <Card
          key={purchase.id}
          className="overflow-hidden hover:border-foreground/30 transition-all cursor-pointer group"
          onClick={() => setSelectedOrder(purchase)}
        >
          <div className="relative h-32 sm:h-36 bg-muted overflow-hidden">
            {purchase.products[0]?.image ? (
              <img src={purchase.products[0].image} alt={businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
            <Badge variant="outline" className={cn("absolute top-2 left-2 text-[10px]", statusBadgeStyles[config.color])}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
            {productCount > 1 && (
              <Badge className="absolute top-2 right-2 text-[10px] bg-foreground/80 text-background border-0">
                {productCount} articles
              </Badge>
            )}
          </div>
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground">
              {new Date(purchase.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              {" • "}{purchase.id}
            </p>
            <p className="font-semibold text-sm text-foreground mt-0.5">{businessName}</p>
            <div className="mt-1.5 space-y-1">
              {purchase.products.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-5 h-5 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted shrink-0" />
                  )}
                  <span className="text-[11px] text-muted-foreground truncate">{item.quantity}x {item.name}</span>
                </div>
              ))}
              {productCount > 2 && (
                <p className="text-[10px] text-muted-foreground/70">+{productCount - 2} autre{productCount - 2 > 1 ? "s" : ""}</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <span className="font-bold text-foreground">{purchase.total.toFixed(2)} €</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary p-0">
                Détails <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        key={purchase.id}
        className="overflow-hidden hover:border-foreground/30 transition-all cursor-pointer"
        onClick={() => setSelectedOrder(purchase)}
      >
        <CardContent className="p-0">
          {/* Header: date, business, status */}
          <div className="flex items-center justify-between gap-2 p-3 pb-0 md:p-4 md:pb-0">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">
                {new Date(purchase.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                {" • "}{purchase.id}
              </p>
              <p className="font-semibold text-sm text-foreground">{businessName}</p>
            </div>
            <Badge variant="outline" className={cn("text-[10px] md:text-xs shrink-0", statusBadgeStyles[config.color])}>
              <StatusIcon className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{config.label}</span>
              <span className="sm:hidden">{config.label.split(" ")[0]}</span>
            </Badge>
          </div>

          {/* Products list */}
          <div className="px-3 md:px-4 mt-2 space-y-1.5">
            {purchase.products.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded-md object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Qté: {item.quantity} • {item.price.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer: total + details */}
          <div className="flex items-center justify-between mx-3 md:mx-4 mt-2 mb-3 md:mb-4 pt-2 border-t border-border/50">
            <div>
              <p className="text-[10px] text-muted-foreground">{productCount} article{productCount > 1 ? "s" : ""}</p>
              <p className="font-bold text-foreground">{purchase.total.toFixed(2)} €</p>
            </div>
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary">
              Détails <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout title="Mes Achats" subtitle="Suivez vos commandes et confirmez leur réception.">
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatsCard title="Total achats" value={String(mockPurchases.length)} icon={<ShoppingBag className="h-5 w-5 text-foreground" />} />
          <StatsCard title="En cours" value={String(activeCount)} icon={<Truck className="h-5 w-5 text-foreground" />} />
          <StatsCard title="Livrées" value={String(deliveredCount)} icon={<PackageCheck className="h-5 w-5 text-foreground" />} />
          <StatsCard title="En attente" value={String(pendingCount)} icon={<Clock className="h-5 w-5 text-foreground" />} />
        </div>

        {/* Search, Sort & View Mode */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Toutes</TabsTrigger>
            <TabsTrigger value="active" className="gap-1 text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">
              En cours
              {activeCount > 0 && (
                <Badge variant="outline" className="ml-0.5 h-4 w-4 md:h-5 md:w-5 p-0 flex items-center justify-center text-[9px] md:text-[10px] border-background/50 text-background">
                  {activeCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Livrées</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Terminées</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">En attente</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-0">
            {paginated.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">Aucun achat trouvé</h3>
                <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {paginated.map(renderPurchaseCard)}
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map(renderPurchaseCard)}
              </div>
            )}

            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
