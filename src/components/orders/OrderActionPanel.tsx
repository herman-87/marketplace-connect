import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Check, X, CreditCard, Truck, PackageCheck, AlertCircle,
  Ban, RefreshCw, Smartphone, Banknote, MessageSquare
} from "lucide-react";
import { OrderStatus, UserRole, ORDER_STATUS_CONFIG } from "@/types/order";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { RejectionReasonDialog } from "./RejectionReasonDialog";

interface OrderActionPanelProps {
  orderId: string;
  status: OrderStatus;
  role: UserRole;
  total: number;
  deliveryFee?: number;
  onStatusChange: (newStatus: OrderStatus, data?: Record<string, string>) => void;
}

export function OrderActionPanel({ orderId, status, role, total, deliveryFee, onStatusChange }: OrderActionPanelProps) {
  // Accept flow
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState("");
  const [confirmAccept, setConfirmAccept] = useState(false);

  // Reject flow
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Payment flow
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [confirmPayment, setConfirmPayment] = useState(false);

  // Generic confirmation dialogs
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDeliveryPrep, setConfirmDeliveryPrep] = useState(false);
  const [confirmAssignDriver, setConfirmAssignDriver] = useState(false);
  const [confirmDelivered, setConfirmDelivered] = useState(false);
  const [confirmReception, setConfirmReception] = useState(false);
  const [confirmDispute, setConfirmDispute] = useState(false);
  const [confirmRetryPayment, setConfirmRetryPayment] = useState(false);

  const totalWithDelivery = total + (deliveryFee || 0);
  const config = ORDER_STATUS_CONFIG[status];

  // =========== BUSINESS ACTIONS ===========
  if (role === "business") {
    if (status === "CREATED") {
      if (showAcceptForm) {
        return (
          <>
            <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium">Frais de livraison</p>
              <p className="text-xs text-muted-foreground">Indiquez le montant des frais de livraison avant d'accepter.</p>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={deliveryFeeInput}
                  onChange={(e) => setDeliveryFeeInput(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
              </div>
              {deliveryFeeInput && parseFloat(deliveryFeeInput) > 0 && (
                <div className="p-3 rounded-lg bg-muted/50 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total produits</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frais de livraison</span>
                    <span>{parseFloat(deliveryFeeInput).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-border/50 pt-1.5">
                    <span>Total client</span>
                    <span>{(total + parseFloat(deliveryFeeInput)).toFixed(2)} €</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  className="flex-1 h-10 text-sm font-semibold gap-2"
                  onClick={() => setConfirmAccept(true)}
                >
                  <Check className="h-4 w-4" />
                  Accepter
                </Button>
                <Button size="sm" variant="outline" className="h-10" onClick={() => setShowAcceptForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>

            <ConfirmationDialog
              open={confirmAccept}
              onOpenChange={setConfirmAccept}
              title="Confirmer l'acceptation"
              description={`Vous allez accepter cette commande${deliveryFeeInput && parseFloat(deliveryFeeInput) > 0 ? ` avec ${parseFloat(deliveryFeeInput).toFixed(2)} € de frais de livraison` : ""}. Le client pourra ensuite procéder au paiement.`}
              confirmLabel="Accepter la commande"
              onConfirm={() => {
                const fee = deliveryFeeInput || "0";
                onStatusChange("ACCEPTED", { deliveryFee: fee });
                setTimeout(() => onStatusChange("PENDING_PAYMENT"), 100);
                toast.success("Commande acceptée ! Le client peut maintenant payer.");
                setShowAcceptForm(false);
              }}
            />
          </>
        );
      }

      return (
        <>
          <div className="space-y-2">
            <Button
              className="w-full h-12 text-sm font-semibold gap-2"
              onClick={() => setShowAcceptForm(true)}
            >
              <Check className="h-4 w-4" />
              Accepter la commande
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 text-sm gap-2 text-destructive hover:text-destructive"
              onClick={() => setShowRejectDialog(true)}
            >
              <X className="h-4 w-4" />
              Refuser
            </Button>
          </div>

          <RejectionReasonDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            onConfirm={(reason) => {
              onStatusChange("REJECTED", { reason });
              toast.error("Commande refusée");
              setShowRejectDialog(false);
            }}
          />
        </>
      );
    }

    if (status === "PAID") {
      return (
        <>
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            onClick={() => setConfirmDeliveryPrep(true)}
          >
            <Truck className="h-4 w-4" />
            Préparer pour livraison
          </Button>
          <ConfirmationDialog
            open={confirmDeliveryPrep}
            onOpenChange={setConfirmDeliveryPrep}
            title="Préparer pour livraison"
            description="Confirmez que la commande est prête et peut être confiée à un livreur."
            confirmLabel="Confirmer"
            onConfirm={() => {
              onStatusChange("PENDING_DELIVERY");
              toast.success("Commande prête à être livrée");
            }}
          />
        </>
      );
    }

    if (status === "PENDING_DELIVERY") {
      return (
        <>
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            onClick={() => setConfirmAssignDriver(true)}
          >
            <Truck className="h-4 w-4" />
            Assigner un livreur
          </Button>
          <ConfirmationDialog
            open={confirmAssignDriver}
            onOpenChange={setConfirmAssignDriver}
            title="Assigner un livreur"
            description="Un livreur sera assigné et la commande passera en livraison."
            confirmLabel="Assigner"
            onConfirm={() => {
              onStatusChange("IN_DELIVERY");
              toast.success("Livreur assigné, en route !");
            }}
          />
        </>
      );
    }

    if (status === "IN_DELIVERY") {
      return (
        <>
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            onClick={() => setConfirmDelivered(true)}
          >
            <PackageCheck className="h-4 w-4" />
            Marquer comme livrée
          </Button>
          <ConfirmationDialog
            open={confirmDelivered}
            onOpenChange={setConfirmDelivered}
            title="Confirmer la livraison"
            description="Confirmez que cette commande a bien été livrée au client."
            confirmLabel="Marquer comme livrée"
            onConfirm={() => {
              onStatusChange("DELIVERED");
              toast.success("Commande marquée comme livrée");
            }}
          />
        </>
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

    return (
      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
        <p className="text-sm text-muted-foreground">Aucune action requise pour le moment</p>
      </div>
    );
  }

  // =========== CLIENT ACTIONS ===========
  if (status === "CREATED") {
    return (
      <>
        <Button
          variant="outline"
          className="w-full h-12 text-sm font-semibold gap-2 text-destructive hover:text-destructive"
          onClick={() => setConfirmCancel(true)}
        >
          <Ban className="h-4 w-4" />
          Annuler la commande
        </Button>
        <ConfirmationDialog
          open={confirmCancel}
          onOpenChange={setConfirmCancel}
          title="Annuler la commande"
          description="Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible."
          confirmLabel="Annuler la commande"
          variant="destructive"
          onConfirm={() => {
            onStatusChange("CANCELLED_BY_CLIENT");
            toast.info("Commande annulée");
          }}
        />
      </>
    );
  }

  if (status === "PENDING_PAYMENT") {
    if (showPaymentForm) {
      return (
        <>
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
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  <method.icon className="h-5 w-5" />
                  {method.label}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Sous-total produits</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              {deliveryFee != null && deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Frais de livraison</span>
                  <span>{deliveryFee.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t border-border/50 pt-1.5">
                <span className="text-sm">Total à payer</span>
                <span className="text-lg">{totalWithDelivery.toFixed(2)} €</span>
              </div>
            </div>
            <Button
              className="w-full h-12 text-sm font-semibold gap-2"
              disabled={!paymentMethod}
              onClick={() => setConfirmPayment(true)}
            >
              <CreditCard className="h-4 w-4" />
              Payer {totalWithDelivery.toFixed(2)} €
            </Button>
            <Button
              variant="ghost"
              className="w-full h-9 text-xs"
              onClick={() => { setShowPaymentForm(false); setPaymentMethod(null); }}
            >
              Annuler
            </Button>
          </div>

          <ConfirmationDialog
            open={confirmPayment}
            onOpenChange={setConfirmPayment}
            title="Confirmer le paiement"
            description={`Vous allez payer ${totalWithDelivery.toFixed(2)} € via ${paymentMethod === "mobile_money" ? "Mobile Money" : paymentMethod === "card" ? "Carte bancaire" : "Cash"}. Confirmez-vous ?`}
            confirmLabel={`Payer ${totalWithDelivery.toFixed(2)} €`}
            onConfirm={() => {
              onStatusChange("PAID", { method: paymentMethod! });
              toast.success("Paiement effectué !");
              setShowPaymentForm(false);
              setPaymentMethod(null);
            }}
          />
        </>
      );
    }

    return (
      <div className="space-y-3">
        {deliveryFee != null && deliveryFee > 0 && (
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sous-total produits</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Frais de livraison (ajoutés par le vendeur)</span>
              <span>{deliveryFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border/50 pt-1.5">
              <span>Total à payer</span>
              <span>{totalWithDelivery.toFixed(2)} €</span>
            </div>
          </div>
        )}
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => setShowPaymentForm(true)}
        >
          <CreditCard className="h-4 w-4" />
          Procéder au paiement — {totalWithDelivery.toFixed(2)} €
        </Button>
      </div>
    );
  }

  if (status === "DELIVERED") {
    return (
      <>
        <div className="space-y-2">
          <Button
            className="w-full h-12 text-sm font-semibold gap-2"
            onClick={() => setConfirmReception(true)}
          >
            <PackageCheck className="h-4 w-4" />
            Confirmer la réception
          </Button>
          <Button
            variant="outline"
            className="w-full h-10 text-sm gap-2 text-warning hover:text-warning"
            onClick={() => setConfirmDispute(true)}
          >
            <AlertCircle className="h-4 w-4" />
            Signaler un problème
          </Button>
        </div>

        <ConfirmationDialog
          open={confirmReception}
          onOpenChange={setConfirmReception}
          title="Confirmer la réception"
          description="Confirmez-vous avoir bien reçu votre commande en bon état ?"
          confirmLabel="Confirmer la réception"
          onConfirm={() => {
            onStatusChange("COMPLETED");
            toast.success("Réception confirmée !");
          }}
        />

        <ConfirmationDialog
          open={confirmDispute}
          onOpenChange={setConfirmDispute}
          title="Signaler un problème"
          description="Vous êtes sur le point d'ouvrir un litige. Le vendeur sera notifié et un médiateur interviendra si nécessaire."
          confirmLabel="Ouvrir un litige"
          variant="warning"
          onConfirm={() => {
            onStatusChange("DISPUTED");
            toast.warning("Litige ouvert");
          }}
        />
      </>
    );
  }

  if (status === "PAYMENT_FAILED") {
    return (
      <>
        <Button
          className="w-full h-12 text-sm font-semibold gap-2"
          onClick={() => setConfirmRetryPayment(true)}
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer le paiement
        </Button>
        <ConfirmationDialog
          open={confirmRetryPayment}
          onOpenChange={setConfirmRetryPayment}
          title="Réessayer le paiement"
          description="Vous allez être redirigé vers la page de paiement pour réessayer."
          confirmLabel="Réessayer"
          onConfirm={() => {
            onStatusChange("PENDING_PAYMENT");
            toast.info("Vous pouvez réessayer le paiement");
          }}
        />
      </>
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
