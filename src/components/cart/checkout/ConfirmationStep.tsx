import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Store, ShoppingBag, Package, MapPin, User, Phone, FileText, Info } from "lucide-react";
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
      <div className="flex-1 overflow-auto min-h-0 pb-24">
        <div className="max-w-[1000px] mx-auto">
          {/* Info banner - full width */}
          <div className="w-full p-3.5 rounded-xl border border-primary/20 bg-primary/5 mb-5">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-1.5">
              <Info className="w-4 h-4 text-primary shrink-0" />
              Vérifiez votre commande avant de confirmer
            </h4>
            <div className="text-xs text-muted-foreground space-y-0.5 pl-6">
              <p>• Votre commande sera envoyée au vendeur pour validation. Aucun paiement ne sera prélevé à cette étape.</p>
              <p>• Vous serez notifié dès que le vendeur aura accepté ou refusé votre commande.</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left column */}
            <div className="flex-1 space-y-5 min-w-0">
              {/* Seller card */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
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

              {/* Articles commandés */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-3">
                  Articles commandés
                </h4>
                <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                  {selectedSubCart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-card">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            x{item.quantity}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {item.price.toFixed(2)} € / unité
                          </span>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-foreground shrink-0">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresse de livraison - outside scroll area */}
              {deliveryData && (
                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Adresse de livraison
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{deliveryData.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{deliveryData.phone}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</span>
                    </div>
                    {deliveryData.deliveryInstruction && (
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground italic">{deliveryData.deliveryInstruction}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - sticky summary */}
            <div className="lg:w-[300px] shrink-0">
              <div className="p-5 rounded-xl border border-border bg-card lg:sticky lg:top-0 space-y-4">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Résumé de la commande
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total ({selectedSubCart.items.length} articles)</span>
                    <span className="font-medium">{selectedSubCart.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-muted-foreground italic text-xs">Après acceptation</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {totalWithDelivery.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-center gap-4 max-w-[500px] mx-auto">
          <Button
            variant="ghost"
            className="h-12 px-6 gap-2 font-medium"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button
            className="h-12 px-8 gap-2 font-semibold rounded-[10px] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            onClick={onConfirm}
          >
            <ShoppingBag className="w-5 h-5" />
            Confirmer la commande
          </Button>
        </div>
      </div>
    </div>
  );
}
