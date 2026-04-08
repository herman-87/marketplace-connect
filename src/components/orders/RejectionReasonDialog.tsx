import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PackageX, Store, Hash, DoorClosed, Clock, Users,
  Wrench, MapPinOff, Timer, UserX, ShieldAlert, FileQuestion,
  MapPin, UserMinus, CreditCard, BadgeDollarSign, ShoppingCart,
  Sparkles, MoreHorizontal,
} from "lucide-react";

const REJECTION_REASONS = [
  { id: "out_of_stock", label: "Rupture de stock", icon: PackageX },
  { id: "product_unavailable", label: "Produit indisponible", icon: Store },
  { id: "insufficient_quantity", label: "Quantité insuffisante", icon: Hash },
  { id: "store_closed", label: "Boutique fermée", icon: DoorClosed },
  { id: "too_busy", label: "Trop occupé", icon: Clock },
  { id: "staff_unavailable", label: "Personnel indisponible", icon: Users },
  { id: "equipment_failure", label: "Panne d'équipement", icon: Wrench },
  { id: "delivery_area", label: "Zone non couverte", icon: MapPinOff },
  { id: "delivery_time", label: "Délai impossible", icon: Timer },
  { id: "no_driver", label: "Aucun livreur", icon: UserX },
  { id: "suspicious_order", label: "Commande suspecte", icon: ShieldAlert },
  { id: "incomplete_details", label: "Détails incomplets", icon: FileQuestion },
  { id: "invalid_address", label: "Adresse invalide", icon: MapPin },
  { id: "customer_blacklisted", label: "Client bloqué", icon: UserMinus },
  { id: "payment_method", label: "Paiement non accepté", icon: CreditCard },
  { id: "price_error", label: "Erreur de prix", icon: BadgeDollarSign },
  { id: "minimum_not_met", label: "Minimum non atteint", icon: ShoppingCart },
  { id: "special_request", label: "Demande impossible", icon: Sparkles },
  { id: "other", label: "Autre", icon: MoreHorizontal },
] as const;

interface RejectionReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function RejectionReasonDialog({ open, onOpenChange, onConfirm }: RejectionReasonDialogProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");

  const handleConfirm = () => {
    if (!selected) return;
    const reason = selected === "other"
      ? `Autre : ${otherText}`
      : REJECTION_REASONS.find(r => r.id === selected)?.label || selected;
    onConfirm(reason);
    setSelected(null);
    setOtherText("");
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setSelected(null);
      setOtherText("");
    }
    onOpenChange(value);
  };

  const isConfirmDisabled = !selected || (selected === "other" && !otherText.trim());

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">Refuser la commande</DialogTitle>
          <DialogDescription className="text-sm">
            Sélectionnez la raison du refus. Le client sera informé.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REJECTION_REASONS.map((reason) => {
              const Icon = reason.icon;
              const isSelected = selected === reason.id;
              return (
                <button
                  key={reason.id}
                  onClick={() => setSelected(reason.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all text-xs",
                    isSelected
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="leading-tight">{reason.label}</span>
                </button>
              );
            })}
          </div>

          {selected === "other" && (
            <div className="mt-3">
              <Textarea
                placeholder="Décrivez la raison du refus..."
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-border/40">
          <Button variant="outline" className="h-10 text-sm" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="h-10 text-sm"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            Confirmer le refus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
