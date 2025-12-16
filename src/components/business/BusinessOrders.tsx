import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, Package, Truck, AlertCircle } from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    avatar?: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  createdAt: string;
  rejectionReason?: string;
}

interface BusinessOrdersProps {
  orders: Order[];
}

function OrderCard({ order }: { order: Order }) {
  const statusConfig = {
    pending: { 
      label: "En attente", 
      variant: "outline" as const, 
      icon: Clock,
      color: "text-warning"
    },
    accepted: { 
      label: "Acceptée", 
      variant: "default" as const, 
      icon: Package,
      color: "text-info"
    },
    rejected: { 
      label: "Refusée", 
      variant: "destructive" as const, 
      icon: AlertCircle,
      color: "text-destructive"
    },
    delivered: { 
      label: "Livrée", 
      variant: "secondary" as const, 
      icon: Truck,
      color: "text-success"
    },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={order.customer.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {order.customer.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>

        {/* Products */}
        <div className="space-y-2 mb-4 py-3 border-y border-border/50">
          {order.products.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {product.quantity}x {product.name}
              </span>
              <span className="font-medium">{product.price}€</span>
            </div>
          ))}
        </div>

        {/* Total & Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{order.createdAt}</span>
          <span className="font-bold text-lg">{order.total}€</span>
        </div>

        {/* Rejection Reason */}
        {order.status === "rejected" && order.rejectionReason && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
            <p className="font-medium">Raison du refus :</p>
            <p>{order.rejectionReason}</p>
          </div>
        )}

        {/* Actions */}
        {order.status === "pending" && (
          <div className="flex gap-2">
            <Button className="flex-1 gap-2 gradient-primary text-primary-foreground">
              <Check className="h-4 w-4" />
              Accepter
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10">
              <X className="h-4 w-4" />
              Refuser
            </Button>
          </div>
        )}

        {order.status === "accepted" && (
          <Button className="w-full gap-2" variant="outline">
            <Truck className="h-4 w-4" />
            Marquer comme livrée
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function BusinessOrders({ orders }: BusinessOrdersProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          📋 Commandes
          {counts.pending > 0 && (
            <Badge className="gradient-primary text-primary-foreground animate-pulse">
              {counts.pending} en attente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="gap-2">
            Toutes <Badge variant="secondary" className="text-xs">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            En attente <Badge variant="secondary" className="text-xs">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-2">
            Acceptées <Badge variant="secondary" className="text-xs">{counts.accepted}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            Livrées <Badge variant="secondary" className="text-xs">{counts.delivered}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Refusées <Badge variant="secondary" className="text-xs">{counts.rejected}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 p-8 text-center">
              <p className="text-muted-foreground">Aucune commande dans cette catégorie</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
