import { Clock, CheckCircle2, XCircle, Truck, CreditCard, Package, PackageCheck, Ban, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OrderStatus, ORDER_STATUS_CONFIG } from "@/types/order";

interface RecentOrder {
  id: string;
  customerName: string;
  businessName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  itemsCount: number;
}

const iconMap: Record<string, React.ElementType> = {
  Clock, CheckCircle: CheckCircle2, XCircle, CreditCard, CheckCircle2,
  Package, Truck, PackageCheck, Ban, AlertTriangle, AlertCircle,
};

const mockOrders: RecentOrder[] = [
  {
    id: "ORD-001",
    customerName: "Marie Martin",
    businessName: "RestauFast",
    amount: 45.90,
    status: "CREATED",
    createdAt: "Il y a 5 min",
    itemsCount: 3,
  },
  {
    id: "ORD-002",
    customerName: "Pierre Dubois",
    businessName: "TechStore",
    amount: 129.00,
    status: "PENDING_PAYMENT",
    createdAt: "Il y a 15 min",
    itemsCount: 2,
  },
  {
    id: "ORD-003",
    customerName: "Sophie Leroy",
    businessName: "RestauFast",
    amount: 32.50,
    status: "DELIVERED",
    createdAt: "Il y a 1h",
    itemsCount: 4,
  },
  {
    id: "ORD-004",
    customerName: "Lucas Bernard",
    businessName: "ModeBoutique",
    amount: 89.99,
    status: "REJECTED",
    createdAt: "Il y a 2h",
    itemsCount: 1,
  },
];

const colorMap: Record<string, string> = {
  success: "bg-green-500/10 text-green-600 border-green-500/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  secondary: "bg-muted text-muted-foreground border-border",
  default: "bg-primary/10 text-primary border-primary/30",
};

export function RecentOrders() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockOrders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status];
            const StatusIcon = iconMap[config.icon] || Clock;
            const statusClass = colorMap[config.color] || colorMap.default;

            return (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-muted transition-colors"
              >
                {/* Status Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    statusClass
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
                  <Badge variant="outline" className={cn("hidden sm:flex", statusClass)}>
                    {config.label}
                  </Badge>
                </div>

                {/* Actions for CREATED status (business perspective) */}
                {order.status === "CREATED" && (
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
