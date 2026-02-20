import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Clock, Package, MessageCircle, History } from "lucide-react";
import { Order, OrderStatus, UserRole, ORDER_STATUS_CONFIG } from "@/types/order";
import { OrderTimeline } from "./OrderTimeline";
import { OrderActionPanel } from "./OrderActionPanel";
import { OrderChat } from "./OrderChat";
import { cn } from "@/lib/utils";

interface OrderDetailViewProps {
  order: Order;
  role: UserRole;
  onBack: () => void;
}

const deliveryLabels: Record<string, string> = {
  standard: "Standard (2-3 jours)",
  express: "Express (24h)",
  scheduled: "Programmée",
};

export function OrderDetailView({ order: initialOrder, role, onBack }: OrderDetailViewProps) {
  const [order, setOrder] = useState(initialOrder);
  const config = ORDER_STATUS_CONFIG[order.status];

  const handleStatusChange = (newStatus: OrderStatus, data?: Record<string, string>) => {
    const newEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: data?.reason || data?.method ? `Via ${data.method}` : undefined,
    };
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      statusHistory: [...prev.statusHistory, newEntry],
      rejectionReason: data?.reason || prev.rejectionReason,
      paymentMethod: data?.method || prev.paymentMethod,
    }));
  };

  const statusColor = {
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    secondary: "bg-muted text-muted-foreground border-border",
    default: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base md:text-lg font-semibold">#{order.id}</h2>
            <Badge variant="outline" className={cn("text-[10px] md:text-xs", statusColor[config.color])}>
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{config.description}</p>
        </div>
      </div>

      {/* Main content - stacked on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Left: Order info + products */}
        <div className="lg:col-span-3 space-y-4">
          {/* Customer / Business info */}
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {order.customer.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{order.customer.name}</p>
                {order.customer.phone && (
                  <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                )}
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground p-2.5 rounded-lg bg-muted/30">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-xs">Adresse de livraison</p>
                  <p>{order.deliveryAddress}</p>
                </div>
              </div>
            )}

            {order.deliveryMethod && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span>{deliveryLabels[order.deliveryMethod] || order.deliveryMethod}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Commandé le {new Date(order.createdAt).toLocaleString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</span>
            </div>
          </div>

          {/* Products */}
          <div className="p-4 rounded-xl bg-card border border-border/60">
            <h3 className="text-sm font-semibold mb-3">Produits ({order.products.length})</h3>
            <div className="space-y-3">
              {order.products.map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qté: {product.quantity}</p>
                  </div>
                  <span className="font-semibold text-sm shrink-0">{product.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold">{order.total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Rejection reason if applicable */}
          {order.rejectionReason && (
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Motif du refus</p>
              <p className="text-sm text-muted-foreground">{order.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Right: Timeline + Chat + Action Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-card border border-border/60 overflow-hidden">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="w-full rounded-none border-b border-border/60 bg-muted/30 h-auto p-0">
                <TabsTrigger value="timeline" className="flex-1 gap-1.5 rounded-none data-[state=active]:bg-background py-2.5 text-xs">
                  <History className="h-3.5 w-3.5" />
                  Suivi
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1 gap-1.5 rounded-none data-[state=active]:bg-background py-2.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discussion
                </TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-0 p-4">
                <OrderTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
              </TabsContent>
              <TabsContent value="chat" className="mt-0 h-[400px]">
                <OrderChat
                  orderId={order.id}
                  role={role}
                  senderName={role === "client" ? order.customer.name : "Business"}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Panel - sticky on desktop */}
          <div className="hidden lg:block sticky top-4">
            <div className="p-4 rounded-xl bg-card border border-border/60">
              <h3 className="text-sm font-semibold mb-3">Action</h3>
              <OrderActionPanel
                orderId={order.id}
                status={order.status}
                role={role}
                total={order.total}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-50 lg:hidden">
        <OrderActionPanel
          orderId={order.id}
          status={order.status}
          role={role}
          total={order.total}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Bottom spacer for mobile fixed bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
