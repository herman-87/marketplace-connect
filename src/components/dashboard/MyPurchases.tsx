import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Star,
  ChevronRight,
  PackageCheck,
  CreditCard,
  AlertTriangle,
  Ban,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus, ORDER_STATUS_CONFIG } from "@/types/order";
import { OrderDetailView } from "@/components/orders/OrderDetailView";

const mockPurchases: Order[] = [
  {
    id: "ACH-001",
    customer: { name: "Vous" },
    products: [{ name: "Burger Deluxe Menu", quantity: 2, price: 25.80, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop" }],
    total: 25.80,
    status: "IN_DELIVERY",
    createdAt: "2025-02-15T14:30:00Z",
    deliveryAddress: "12 Rue de la Liberté, Dakar",
    deliveryMethod: "express",
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
    id: "ACH-002",
    customer: { name: "Vous" },
    products: [{ name: "Écouteurs Bluetooth Pro", quantity: 1, price: 79.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" }],
    total: 79.99,
    status: "DELIVERED",
    createdAt: "2025-02-14T10:15:00Z",
    deliveryAddress: "45 Avenue Bourguiba, Dakar",
    deliveryMethod: "standard",
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
    id: "ACH-003",
    customer: { name: "Vous" },
    products: [
      { name: "T-shirt Premium", quantity: 2, price: 69.98, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop" },
      { name: "Jean Slim", quantity: 1, price: 49.99 },
    ],
    total: 119.97,
    status: "COMPLETED",
    createdAt: "2025-01-12T16:45:00Z",
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
    id: "ACH-004",
    customer: { name: "Vous" },
    products: [{ name: "Poulet Yassa", quantity: 1, price: 15.90, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=80&h=80&fit=crop" }],
    total: 15.90,
    status: "PENDING_PAYMENT",
    createdAt: "2025-02-15T12:00:00Z",
    deliveryAddress: "8 Rue Faidherbe, Dakar",
    deliveryMethod: "standard",
    statusHistory: [
      { status: "CREATED", timestamp: "2025-02-15T12:00:00Z" },
      { status: "ACCEPTED", timestamp: "2025-02-15T12:10:00Z" },
      { status: "PENDING_PAYMENT", timestamp: "2025-02-15T12:10:00Z", note: "En attente de paiement" },
    ],
  },
];

const businessNames: Record<string, string> = {
  "ACH-001": "RestauFast",
  "ACH-002": "TechStore",
  "ACH-003": "ModeBoutique",
  "ACH-004": "Saveurs d'Afrique",
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

export function MyPurchases() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        role="client"
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {mockPurchases.map((purchase) => {
        const config = ORDER_STATUS_CONFIG[purchase.status];
        const StatusIcon = iconMap[config.icon] || Clock;
        const businessName = businessNames[purchase.id] || "Boutique";

        return (
          <Card
            key={purchase.id}
            className="overflow-hidden hover:border-foreground transition-all cursor-pointer"
            onClick={() => setSelectedOrder(purchase)}
          >
            <CardContent className="p-0">
              <div className="flex gap-3 p-3 md:p-4">
                {purchase.products[0]?.image ? (
                  <img
                    src={purchase.products[0].image}
                    alt={businessName}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="font-semibold text-sm text-foreground">{businessName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {purchase.products.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] md:text-xs shrink-0", statusBadgeStyles[config.color])}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{config.label}</span>
                      <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <p className="font-bold text-foreground">{purchase.total.toFixed(2)} €</p>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary">
                      Détails
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
