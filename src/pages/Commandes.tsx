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
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusConfig[order.status].className
            )}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{order.id}</p>
              <Badge
                variant="outline"
                className={cn(statusConfig[order.status].className)}
              >
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
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
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-medium text-foreground">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Store className="w-4 h-4" />
            <span>{order.businessName}</span>
            {!order.isOwner && (
              <Badge variant="outline" className="ml-2 text-xs">
                Collaborateur
              </Badge>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="text-muted-foreground">
                {(item.quantity * item.price).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">
              {order.total.toFixed(2)} €
            </p>
          </div>

          {order.status === "pending" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Refuser
              </Button>
              <Button size="sm" className="gradient-primary border-0">
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
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{acceptedCount}</p>
              <p className="text-sm text-muted-foreground">Acceptées</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Livrées ce mois</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">€</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">847</p>
              <p className="text-sm text-muted-foreground">Revenus du mois</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une commande..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              En attente
              {pendingCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] gradient-primary border-0">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">Acceptées</TabsTrigger>
            <TabsTrigger value="delivered">Livrées</TabsTrigger>
            <TabsTrigger value="rejected">Refusées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              {mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "pending")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "accepted")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              {mockOrders
                .filter((o) => o.status === "delivered")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
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
