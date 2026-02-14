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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Purchase {
  id: string;
  businessName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "in_delivery" | "delivered" | "completed";
  date: string;
  image: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "ACH-001",
    businessName: "RestauFast",
    items: [{ name: "Burger Deluxe Menu", quantity: 2, price: 12.90 }],
    total: 25.80,
    status: "in_delivery",
    date: "Aujourd'hui, 14:30",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop",
  },
  {
    id: "ACH-002",
    businessName: "TechStore",
    items: [{ name: "Écouteurs Bluetooth Pro", quantity: 1, price: 79.99 }],
    total: 79.99,
    status: "delivered",
    date: "Hier, 10:15",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  },
  {
    id: "ACH-003",
    businessName: "ModeBoutique",
    items: [
      { name: "T-shirt Premium", quantity: 2, price: 34.99 },
      { name: "Jean Slim", quantity: 1, price: 49.99 },
    ],
    total: 119.97,
    status: "completed",
    date: "12 Jan, 16:45",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop",
  },
  {
    id: "ACH-004",
    businessName: "Saveurs d'Afrique",
    items: [{ name: "Poulet Yassa", quantity: 1, price: 15.90 }],
    total: 15.90,
    status: "pending",
    date: "Aujourd'hui, 12:00",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=80&h=80&fit=crop",
  },
];

const statusConfig = {
  pending: { label: "En préparation", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  confirmed: { label: "Confirmée", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  in_delivery: { label: "En livraison", icon: Truck, className: "bg-info/10 text-info border-info/20" },
  delivered: { label: "Livrée", icon: PackageCheck, className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Terminée", icon: CheckCircle2, className: "bg-muted text-muted-foreground border-border" },
};

export function MyPurchases() {
  return (
    <div className="space-y-3">
      {mockPurchases.map((purchase) => {
        const config = statusConfig[purchase.status];
        const StatusIcon = config.icon;
        return (
          <Card key={purchase.id} className="overflow-hidden hover:border-primary/30 transition-all">
            <CardContent className="p-0">
              <div className="flex gap-3 p-3 md:p-4">
                <img
                  src={purchase.image}
                  alt={purchase.businessName}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{purchase.date}</p>
                      <p className="font-semibold text-sm md:text-base text-foreground">{purchase.businessName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {purchase.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] md:text-xs shrink-0", config.className)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                    <p className="font-bold text-foreground">{purchase.total.toFixed(2)} €</p>
                    <div className="flex gap-2">
                      {purchase.status === "delivered" && (
                        <Button size="sm" className="h-7 text-xs gap-1">
                          <PackageCheck className="w-3 h-3" />
                          Confirmer réception
                        </Button>
                      )}
                      {purchase.status === "completed" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Star className="w-3 h-3" />
                          Évaluer
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                        Détails
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
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
