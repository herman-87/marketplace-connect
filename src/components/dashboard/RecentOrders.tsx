import { Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customerName: string;
  businessName: string;
  amount: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  createdAt: string;
  itemsCount: number;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Marie Martin",
    businessName: "RestauFast",
    amount: 45.90,
    status: "pending",
    createdAt: "Il y a 5 min",
    itemsCount: 3,
  },
  {
    id: "ORD-002",
    customerName: "Pierre Dubois",
    businessName: "TechStore",
    amount: 129.00,
    status: "accepted",
    createdAt: "Il y a 15 min",
    itemsCount: 2,
  },
  {
    id: "ORD-003",
    customerName: "Sophie Leroy",
    businessName: "RestauFast",
    amount: 32.50,
    status: "delivered",
    createdAt: "Il y a 1h",
    itemsCount: 4,
  },
  {
    id: "ORD-004",
    customerName: "Lucas Bernard",
    businessName: "ModeBoutique",
    amount: 89.99,
    status: "rejected",
    createdAt: "Il y a 2h",
    itemsCount: 1,
  },
];

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  accepted: {
    label: "Acceptée",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/30",
  },
  rejected: {
    label: "Refusée",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  delivered: {
    label: "Livrée",
    icon: Truck,
    className: "bg-primary/10 text-primary border-primary/30",
  },
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Commandes récentes</CardTitle>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
              >
                {/* Status Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    statusConfig[order.status].className
                  )}
                >
                  <StatusIcon className="h-5 w-5" />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {order.customerName}
                    </p>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {order.businessName}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""} • {order.createdAt}
                  </p>
                </div>

                {/* Amount & Status */}
                <div className="flex items-center gap-3 shrink-0">
                  <p className="font-semibold text-foreground">
                    {order.amount.toFixed(2)} €
                  </p>
                  <Badge variant="outline" className={cn("hidden sm:flex", statusConfig[order.status].className)}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>

                {/* Actions for pending */}
                {order.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="h-8">
                      Refuser
                    </Button>
                    <Button size="sm" className="h-8">
                      Accepter
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
