import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    icon: CheckCircle2,
    className: "bg-info/10 text-info border-info/20",
  },
};

export function RecentOrders() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Commandes récentes</h3>
          <p className="text-sm text-muted-foreground">
            Dernières commandes de vos business
          </p>
        </div>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </div>

      <div className="divide-y divide-border">
        {mockOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          return (
            <div
              key={order.id}
              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    statusConfig[order.status].className
                  )}
                >
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.businessName} • {order.itemsCount} article
                    {order.itemsCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {order.amount.toFixed(2)} €
                </p>
                <p className="text-xs text-muted-foreground">{order.createdAt}</p>
              </div>

              <Badge
                variant="outline"
                className={cn("ml-4", statusConfig[order.status].className)}
              >
                {statusConfig[order.status].label}
              </Badge>

              {order.status === "pending" && (
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" className="h-8">
                    Refuser
                  </Button>
                  <Button size="sm" className="h-8 gradient-primary border-0">
                    Accepter
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
