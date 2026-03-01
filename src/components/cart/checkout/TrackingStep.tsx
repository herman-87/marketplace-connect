import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Store,
  CreditCard,
  PackageCheck,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_CONFIG } from "@/types/order";

interface TrackingStepProps {
  onBack: () => void;
  onClose: () => void;
}

// Mock order - starts at CREATED (just placed from cart)
const mockOrder = {
  id: 'ORD-ABC123',
  status: 'CREATED' as OrderStatus,
  createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  businessName: 'Chez Mama',
  items: [
    { name: 'Poulet Yassa', quantity: 2, price: 15.99 },
    { name: 'Riz au gras', quantity: 1, price: 12.50 },
  ],
  total: 44.48,
  deliveryAddress: '123 Rue de la Paix, Paris 75001',
  estimatedDelivery: 'Après acceptation et paiement',
};

// Full lifecycle timeline
const statusTimeline: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'CREATED', label: 'Commande envoyée', description: 'En attente de validation par le vendeur' },
  { status: 'ACCEPTED', label: 'Acceptée par le vendeur', description: 'Le vendeur peut satisfaire votre commande' },
  { status: 'PENDING_PAYMENT', label: 'En attente de paiement', description: 'Procédez au paiement pour confirmer' },
  { status: 'PAID', label: 'Paiement confirmé', description: 'Votre paiement a été reçu' },
  { status: 'PENDING_DELIVERY', label: 'En préparation', description: 'Le vendeur prépare votre commande' },
  { status: 'IN_DELIVERY', label: 'En livraison', description: 'Un livreur est en route' },
  { status: 'DELIVERED', label: 'Livrée', description: 'Votre commande a été livrée' },
];

const statusToProgress: Record<OrderStatus, number> = {
  CREATED: 8,
  ACCEPTED: 18,
  REJECTED: 0,
  PENDING_PAYMENT: 28,
  PAID: 42,
  PENDING_DELIVERY: 56,
  IN_DELIVERY: 72,
  DELIVERED: 90,
  COMPLETED: 100,
  CANCELLED_BY_CLIENT: 0,
  PAYMENT_FAILED: 0,
  DELIVERY_FAILED: 0,
  ACCEPTANCE_TIMEOUT: 0,
  DISPUTED: 50,
};

const getStatusIcon = (status: OrderStatus) => {
  const icons: Record<string, React.ElementType> = {
    CREATED: Clock,
    ACCEPTED: CheckCircle2,
    REJECTED: XCircle,
    PENDING_PAYMENT: CreditCard,
    PAID: CheckCircle2,
    PENDING_DELIVERY: Package,
    IN_DELIVERY: Truck,
    DELIVERED: PackageCheck,
    COMPLETED: CheckCircle2,
    CANCELLED_BY_CLIENT: Ban,
    PAYMENT_FAILED: AlertTriangle,
    DELIVERY_FAILED: AlertTriangle,
    ACCEPTANCE_TIMEOUT: Clock,
    DISPUTED: AlertTriangle,
  };
  return icons[status] || Clock;
};

export function TrackingStep({ onBack, onClose }: TrackingStepProps) {
  const config = ORDER_STATUS_CONFIG[mockOrder.status];
  const progressValue = statusToProgress[mockOrder.status];
  const StatusIcon = getStatusIcon(mockOrder.status);

  const currentStatusIndex = statusTimeline.findIndex(s => s.status === mockOrder.status);

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'destructive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Order Status */}
          <div className="flex-1">
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>

            {/* Current Status Card */}
            <div className="p-6 rounded-xl border border-border bg-card mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  config.color === 'success' && "bg-green-500/10 text-green-500",
                  config.color === 'warning' && "bg-orange-500/10 text-orange-500",
                  config.color === 'destructive' && "bg-destructive/10 text-destructive",
                  config.color === 'secondary' && "bg-muted text-muted-foreground"
                )}>
                  <StatusIcon className="w-7 h-7" />
                </div>
                <div>
                  <Badge variant={getBadgeVariant(config.color)} className="mb-1">
                    {config.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progression</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            </div>

            {/* What's next card for CREATED status */}
            {mockOrder.status === 'CREATED' && (
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 mb-6">
                <p className="text-sm font-medium text-foreground mb-1">⏳ En attente du vendeur</p>
                <p className="text-xs text-muted-foreground">
                  Le vendeur vérifie la disponibilité de vos produits. 
                  Vous serez notifié dès qu'il aura accepté votre commande pour procéder au paiement.
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4">Cycle de la commande</h3>
              <div className="space-y-4">
                {statusTimeline.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const StepIcon = getStatusIcon(step.status);

                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2",
                          isCompleted 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-muted border-border text-muted-foreground",
                          isCurrent && "ring-2 ring-offset-2 ring-offset-background ring-primary/30"
                        )}>
                          {isCompleted ? (
                            <StepIcon className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        {index < statusTimeline.length - 1 && (
                          <div className={cn(
                            "w-0.5 h-8 mt-1",
                            index < currentStatusIndex ? "bg-primary" : "bg-border"
                          )} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={cn(
                          "font-medium text-sm",
                          isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <p className={cn(
                          "text-xs mt-0.5",
                          isCurrent ? "text-muted-foreground" : isCompleted ? "text-muted-foreground/80" : "text-muted-foreground/50"
                        )}>
                          {isCurrent ? step.description : isCompleted ? 'Terminé' : 'À venir'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Order Details */}
          <div className="lg:w-96 shrink-0 space-y-4">
            {/* Order Info */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{mockOrder.businessName}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{mockOrder.id}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                {mockOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{mockOrder.total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Livraison
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{mockOrder.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{mockOrder.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
            Annuler la commande
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
