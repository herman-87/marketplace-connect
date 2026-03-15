import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Store,
  ShoppingBag,
  Package,
  MapPin,
  User,
  Phone,
  FileText,
  Truck,
  ShieldCheck,
} from "lucide-react";
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

  const deliveryFee = 0;
  const totalWithDelivery = selectedSubCart.total + deliveryFee;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0">

        {/* Seller */}
        <div className="flex items-center gap-2 mb-3">
          <Store className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{selectedSubCart.businessName}</span>
          <span className="text-xs text-muted-foreground">· {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}</span>
        </div>

        {/* Articles + Delivery side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Articles — left */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {selectedSubCart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card">
                <img src={item.image} alt={item.name} className="w-11 h-11 rounded-md object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} € × {item.quantity}</p>
                </div>
                <p className="text-sm font-bold shrink-0">{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>

          {/* Delivery — right on desktop */}
          {deliveryData && (
            <div className="lg:w-[260px] shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Livraison</span>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 shrink-0" />{deliveryData.fullName}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />{deliveryData.phone}</p>
                <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</p>
                {deliveryData.deliveryInstruction && (
                  <p className="flex items-start gap-2 italic"><FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />{deliveryData.deliveryInstruction}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p>Aucun paiement maintenant. Commande envoyée au vendeur pour validation.</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="sticky bottom-0 pt-3 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{selectedSubCart.total.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Livraison</span>
            <span className="text-muted-foreground italic">Après acceptation</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary text-xl">{totalWithDelivery.toFixed(2)} €</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" className="h-12 px-6 gap-2 font-medium" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              className="h-12 w-[220px] font-semibold gap-2 rounded-[10px] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              size="lg"
              onClick={onConfirm}
            >
              <ShoppingBag className="w-5 h-5" />
              Confirmer la commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
