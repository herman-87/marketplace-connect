import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Check, X, CreditCard, Truck, PackageCheck, AlertCircle,
  Ban, RefreshCw, Smartphone, Banknote, MessageSquare
} from "lucide-react";
import { OrderStatus, UserRole, ORDER_STATUS_CONFIG } from "@/types/order";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderActionPanelProps {
  orderId: string;
  status: OrderStatus;
  role: UserRole;
  total: number;
  onStatusChange: (newStatus: OrderStatus, data?: Record<string, string>) => void;
}

export function OrderActionPanel({ orderId, status, role, total, onStatusChange }: OrderActionPanelProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const config = ORDER_STATUS_CONFIG[status];

  // =========== BUSINESS ACTIONS ===========
  if (role === "business") {
    if (status === "CREATED") {
      if (showRejectForm) {
        return (
          <div className="space-y-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <p className="text-sm font-medium text-destructive">Motif du refus</p>
            <Textarea
              placeholder="Expliquez pourquoi vous refusez cette commande..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 h-10"
                disabled={!rejectReason.trim()}
                onClick={() => {
                  onStatusChange("REJECTED", { reason: rejectReason });
                  toast.error("Commande refusée");
                }}
              >
                <X className="h-4 w-4 mr-1.5" />
                Confirmer le refus
              </Button>
              <Button size="sm" variant="outline" className="h-10" onClick={() => setShowRejectForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            onClick={() => {
              // ACCEPTED then immediately transitions to PENDING_PAYMENT
              onStatusChange("ACCEPTED");
              setTimeout(() => {
                onStatusChange("PENDING_PAYMENT");
              }, 100);
              toast.success("Commande acceptée ! Le client peut maintenant payer.");
            }}
          >
            <Check className="h-4 w-4" />
            Accepter la commande
          </Button>
          <Button
            variant="outline"
            className="w-full h-10 text-sm gap-2 text-destructive hover:text-destructive"
            onClick={() => setShowRejectForm(true)}
          >
            <X className="h-4 w-4" />
            Refuser
          </Button>
        </div>
      );
    }

    if (status === "PAID") {
      return (
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => {
            onStatusChange("PENDING_DELIVERY");
            toast.success("Commande prête à être livrée");
          }}
        >
          <Truck className="h-4 w-4" />
          Préparer pour livraison
        </Button>
      );
    }

    if (status === "PENDING_DELIVERY") {
      return (
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => {
            onStatusChange("IN_DELIVERY");
            toast.success("Livreur assigné, en route !");
          }}
        >
          <Truck className="h-4 w-4" />
          Assigner un livreur
        </Button>
      );
    }

    if (status === "IN_DELIVERY") {
      return (
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => {
            onStatusChange("DELIVERED");
            toast.success("Commande marquée comme livrée");
          }}
        >
          <PackageCheck className="h-4 w-4" />
          Marquer comme livrée
        </Button>
      );
    }

    if (status === "DISPUTED") {
      return (
        <Button
          variant="outline"
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => toast.info("Fonctionnalité à venir")}
        >
          <MessageSquare className="h-4 w-4" />
          Répondre au litige
        </Button>
      );
    }

    // No action for other statuses
    return (
      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
        <p className="text-sm text-muted-foreground">Aucune action requise pour le moment</p>
      </div>
    );
  }

  // =========== CLIENT ACTIONS ===========
  if (status === "CREATED") {
    return (
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-semibold gap-2 text-destructive hover:text-destructive"
        onClick={() => {
          onStatusChange("CANCELLED_BY_CLIENT");
          toast.info("Commande annulée");
        }}
      >
        <Ban className="h-4 w-4" />
        Annuler la commande
      </Button>
    );
  }

  if (status === "PENDING_PAYMENT") {
    if (showPaymentForm) {
      return (
        <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium">Choisissez votre méthode de paiement</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
              { id: "card", label: "Carte", icon: CreditCard },
              { id: "cash", label: "Cash", icon: Banknote },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-xs",
                  paymentMethod === method.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                )}
              >
                <method.icon className="h-5 w-5" />
                {method.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Montant à payer</span>
            <span className="text-lg font-bold">{total.toFixed(2)} €</span>
          </div>
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            disabled={!paymentMethod}
            onClick={() => {
              onStatusChange("PAID", { method: paymentMethod! });
              toast.success("Paiement effectué !");
            }}
          >
            <CreditCard className="h-4 w-4" />
            Payer {total.toFixed(2)} €
          </Button>
          <Button
            variant="ghost"
            className="w-full h-9 text-xs"
            onClick={() => { setShowPaymentForm(false); setPaymentMethod(null); }}
          >
            Annuler
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="w-full h-12 text-sm font-semibold gap-2"
        onClick={() => setShowPaymentForm(true)}
      >
        <CreditCard className="h-4 w-4" />
        Procéder au paiement — {total.toFixed(2)} €
      </Button>
    );
  }

  if (status === "DELIVERED") {
    return (
      <div className="space-y-2">
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => {
            onStatusChange("COMPLETED");
            toast.success("Réception confirmée !");
          }}
        >
          <PackageCheck className="h-4 w-4" />
          Confirmer la réception
        </Button>
        <Button
          variant="outline"
          className="w-full h-10 text-sm gap-2 text-warning hover:text-warning"
          onClick={() => {
            onStatusChange("DISPUTED");
            toast.warning("Litige ouvert");
          }}
        >
          <AlertCircle className="h-4 w-4" />
          Signaler un problème
        </Button>
      </div>
    );
  }

  if (status === "PAYMENT_FAILED") {
    return (
      <Button
        className="w-full h-12 text-sm font-semibold gap-2"
        onClick={() => {
          onStatusChange("PENDING_PAYMENT");
          toast.info("Vous pouvez réessayer le paiement");
        }}
      >
        <RefreshCw className="h-4 w-4" />
        Réessayer le paiement
      </Button>
    );
  }

  // Waiting states
  const waitingMessages: Partial<Record<OrderStatus, string>> = {
    ACCEPTED: "Le vendeur a accepté votre commande. Procédez au paiement.",
    PAID: "Paiement confirmé, le vendeur prépare votre commande",
    PENDING_DELIVERY: "Votre commande est en cours de préparation",
    IN_DELIVERY: "Votre commande est en route 🚚",
    COMPLETED: "Commande terminée avec succès ✅",
    REJECTED: "Cette commande a été refusée par le vendeur",
    CANCELLED_BY_CLIENT: "Vous avez annulé cette commande",
    DELIVERY_FAILED: "Un problème est survenu lors de la livraison",
    ACCEPTANCE_TIMEOUT: "Le vendeur n'a pas répondu à temps",
    DISPUTED: "Un litige est en cours de traitement",
  };

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
      <Badge variant={config.color === "success" ? "default" : config.color === "destructive" ? "destructive" : "secondary"} className="mb-2">
        {config.label}
      </Badge>
      <p className="text-sm text-muted-foreground">{waitingMessages[status] || config.description}</p>
    </div>
  );
}
