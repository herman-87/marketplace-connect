import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  Store,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  createdAt: string;
  isOwner: boolean;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customerName: "Marie Martin",
    customerEmail: "marie@example.com",
    businessName: "RestauFast",
    items: [
      { name: "Burger Gourmet", quantity: 2, price: 14.90 },
      { name: "Frites maison", quantity: 2, price: 4.50 },
    ],
    total: 38.80,
    status: "pending",
    createdAt: "2024-01-15T10:30:00",
    isOwner: true,
  },
  {
    id: "ORD-2024-002",
    customerName: "Pierre Dubois",
    customerEmail: "pierre@example.com",
    businessName: "TechStore",
    items: [
      { name: "Écouteurs Bluetooth Pro", quantity: 1, price: 89.99 },
    ],
    total: 89.99,
    status: "accepted",
    createdAt: "2024-01-15T09:15:00",
    isOwner: true,
  },
  {
    id: "ORD-2024-003",
    customerName: "Sophie Leroy",
    customerEmail: "sophie@example.com",
    businessName: "ModeBoutique",
    items: [
      { name: "T-shirt Premium", quantity: 3, price: 34.99 },
    ],
    total: 104.97,
    status: "delivered",
    createdAt: "2024-01-14T16:45:00",
    isOwner: false,
  },
  {
    id: "ORD-2024-004",
    customerName: "Lucas Bernard",
    customerEmail: "lucas@example.com",
    businessName: "RestauFast",
    items: [
      { name: "Salade César", quantity: 1, price: 12.50 },
    ],
    total: 12.50,
    status: "rejected",
    createdAt: "2024-01-14T12:00:00",
    isOwner: true,
  },
];

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  accepted: {
    label: "Acceptée",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Refusée",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  delivered: {
    label: "Livrée",
    icon: Truck,
    className: "bg-info/10 text-info border-info/20",
  },
};

function OrderCard({ order }: { order: Order }) {
  const StatusIcon = statusConfig[order.status].icon;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div
            className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0",
              statusConfig[order.status].className
            )}
          >
            <StatusIcon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-xs md:text-sm text-foreground">{order.id}</p>
              <Badge
                variant="outline"
                className={cn("text-[10px] md:text-xs", statusConfig[order.status].className)}
              >
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-sm text-muted-foreground">
              <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {formattedDate}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 shrink-0">
              <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Contacter le client</DropdownMenuItem>
            {order.status === "accepted" && (
              <DropdownMenuItem>Marquer comme livrée</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 md:mb-4 gap-2">
          <div>
            <p className="font-medium text-sm md:text-base text-foreground">{order.customerName}</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">{order.customerEmail}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <Store className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{order.businessName}</span>
            {!order.isOwner && (
              <Badge variant="outline" className="ml-1 text-[10px] md:text-xs">
                Collab
              </Badge>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs md:text-sm"
            >
              <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="text-muted-foreground shrink-0 ml-2">
                {(item.quantity * item.price).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
          <div>
            <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
            <p className="text-lg md:text-xl font-bold text-foreground">
              {order.total.toFixed(2)} €
            </p>
          </div>

          {order.status === "pending" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3">
                Refuser
              </Button>
              <Button size="sm" className="gradient-primary border-0 h-7 md:h-8 text-xs md:text-sm px-2 md:px-3">
                Accepter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Commandes() {
  const pendingCount = mockOrders.filter((o) => o.status === "pending").length;
  const acceptedCount = mockOrders.filter((o) => o.status === "accepted").length;

  return (
    <AppLayout
      title="Commandes"
      subtitle="Gérez les commandes de vos business"
    >
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">En attente</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">{acceptedCount}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Acceptées</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 md:w-5 md:h-5 text-info" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">12</p>
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Livrées</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm md:text-base">€</span>
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">847</p>
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Revenus</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Toutes</TabsTrigger>
            <TabsTrigger value="pending" className="gap-1 text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">
              <span className="hidden sm:inline">En attente</span>
              <span className="sm:hidden">Attente</span>
              {pendingCount > 0 && (
                <Badge className="ml-0.5 h-4 w-4 md:h-5 md:w-5 p-0 flex items-center justify-center text-[9px] md:text-[10px] gradient-primary border-0">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Acceptées</TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Livrées</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs md:text-sm px-2 md:px-3 h-7 md:h-8">Refusées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 md:space-y-4">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              {mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 md:space-y-4">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "pending")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-3 md:space-y-4">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "accepted")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="delivered" className="space-y-3 md:space-y-4">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "delivered")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3 md:space-y-4">
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "rejected")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
