import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Store, ShoppingBag, Package, MapPin, User, Phone, FileText } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { DeliveryFormData } from "./DeliveryStep";

interface ConfirmationStepProps {
  selectedBusinessId: string | null;
  deliveryData: DeliveryFormData | null;
  onConfirm: () => void;
  onBack: () => void;
}

export function ConfirmationStep({ selectedBusinessId, deliveryData, onConfirm, onBack }: ConfirmationStepProps) {
  const { subCarts } = useCart();
  const selectedSubCart = subCarts.find(sc => sc.businessId === selectedBusinessId);

  if (!selectedSubCart || selectedSubCart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Panier vide</h3>
        <p className="text-sm text-muted-foreground">Aucun produit trouvé pour cette boutique.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0 space-y-5 pb-4">
        {/* Info banner */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            Vérifiez votre commande avant de confirmer
          </h4>
          <div className="text-xs text-muted-foreground space-y-1.5 pl-6">
            <p>• Votre commande sera envoyée au vendeur pour validation.</p>
            <p>• Vous serez notifié dès que le vendeur aura accepté ou refusé.</p>
            <p>• Aucun paiement ne sera prélevé à cette étape.</p>
          </div>
        </div>

        {/* Business header */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{selectedSubCart.businessName}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Products grid - 2 columns */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
            Articles commandés
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {selectedSubCart.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-3 space-y-1.5">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      x{item.quantity}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {item.price.toLocaleString()} FCFA/u
                    </span>
                  </div>
                  <p className="font-bold text-sm text-primary">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        {deliveryData && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Adresse de livraison
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{deliveryData.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{deliveryData.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</span>
              </div>
              {deliveryData.deliveryInstruction && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground italic">{deliveryData.deliveryInstruction}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <Separator className="mb-3" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Total de la commande</span>
            <span className="text-lg font-bold text-primary">
              {selectedSubCart.total.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="space-y-3">
          <Button
            className="w-full h-12 gap-2 text-base"
            size="lg"
            onClick={onConfirm}
          >
            <ShoppingBag className="w-5 h-5" />
            Confirmer la commande
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
