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
  Clock,
  CreditCard,
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
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto min-h-0">

        {/* Seller header — same style as cart tabs */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/10 mb-3">
          <Store className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{selectedSubCart.businessName}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
            {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Articles — grid 2 cols like cart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
          {selectedSubCart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-2.5 rounded-lg bg-card border border-border"
            >
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-medium truncate">{item.name}</h5>
                  <p className="text-base font-bold text-foreground shrink-0">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} € / unité</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">x{item.quantity}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery info */}
        {deliveryData && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adresse de livraison</h4>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{deliveryData.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{deliveryData.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</span>
              </div>
              {deliveryData.deliveryInstruction && (
                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground italic">{deliveryData.deliveryInstruction}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info message */}
        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Votre commande sera envoyée au vendeur pour validation. Aucun paiement ne sera prélevé à cette étape.</p>
            <p>Vous serez notifié dès que le vendeur aura accepté ou refusé votre commande.</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom — same structure as cart */}
      <div className="sticky bottom-0 pt-3 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Sous-total ({selectedSubCart.items.length} articles)</span>
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
