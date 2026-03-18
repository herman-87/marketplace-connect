import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const [activePanel, setActivePanel] = useState<"timeline" | "chat">("timeline");
  const config = ORDER_STATUS_CONFIG[order.status];

  const handleStatusChange = (newStatus: OrderStatus, data?: Record<string, string>) => {
    const newEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: data?.reason || data?.method ? `Via ${data.method}` : data?.deliveryFee ? `Frais de livraison: ${parseFloat(data.deliveryFee).toFixed(2)} €` : undefined,
    };
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      statusHistory: [...prev.statusHistory, newEntry],
      rejectionReason: data?.reason || prev.rejectionReason,
      paymentMethod: data?.method || prev.paymentMethod,
      deliveryFee: data?.deliveryFee ? parseFloat(data.deliveryFee) : prev.deliveryFee,
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
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

        {/* Right: Timeline / Chat + Action Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-card border border-border/60 overflow-hidden flex flex-col">
            {/* Toggle Switch */}
            <div className="p-3 border-b border-border/40">
              <div className="relative flex bg-muted/50 rounded-xl p-1">
                {/* Animated pill background */}
                <div
                  className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-background shadow-sm border border-border/60 transition-all duration-300 ease-out",
                    activePanel === "timeline" ? "left-1" : "left-[calc(50%+2px)]"
                  )}
                />
                <button
                  onClick={() => setActivePanel("timeline")}
                  className={cn(
                    "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-colors duration-200",
                    activePanel === "timeline"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/70"
                  )}
                >
                  <History className="h-3.5 w-3.5" />
                  Suivi
                </button>
                <button
                  onClick={() => setActivePanel("chat")}
                  className={cn(
                    "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-colors duration-200",
                    activePanel === "chat"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/70"
                  )}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discussion
                  {/* Notification dot placeholder */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="relative">
              {/* Timeline */}
              <div
                className={cn(
                  "transition-all duration-300 ease-out",
                  activePanel === "timeline"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 absolute inset-0 pointer-events-none"
                )}
              >
                <div className="p-4">
                  <OrderTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
                </div>
              </div>

              {/* Chat */}
              <div
                className={cn(
                  "transition-all duration-300 ease-out",
                  activePanel === "chat"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 absolute inset-0 pointer-events-none"
                )}
              >
                <div className="h-[420px]">
                  <OrderChat
                    orderId={order.id}
                    role={role}
                    senderName={role === "client" ? order.customer.name : "Business"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel - sticky on desktop */}
          <div className="hidden md:block sticky top-4">
            <div className="p-4 rounded-xl bg-card border border-border/60">
              <h3 className="text-sm font-semibold mb-3">Action</h3>
              <OrderActionPanel
                orderId={order.id}
                status={order.status}
                role={role}
                total={order.total}
                deliveryFee={order.deliveryFee}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom action bar - above MobileNav */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden">
        <OrderActionPanel
          orderId={order.id}
          status={order.status}
          role={role}
          total={order.total}
          deliveryFee={order.deliveryFee}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Bottom spacer for mobile fixed bar + nav */}
      <div className="h-40 md:hidden" />
    </div>
  );
}
