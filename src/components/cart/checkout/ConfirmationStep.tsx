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
  Info,
  Truck,
  CreditCard,
  ShieldCheck,
  Clock,
  Receipt,
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
      <div className="flex-1 overflow-auto min-h-0 pb-24">
        <div className="max-w-[960px] mx-auto space-y-5">

          {/* Info banner */}
          <div className="p-4 rounded-2xl border border-primary/15 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Vérifiez votre commande</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-primary shrink-0" />
                    Commande envoyée au vendeur pour validation — aucun paiement maintenant.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-primary shrink-0" />
                    Vous serez notifié dès acceptation ou refus.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Left column ── */}
            <div className="flex-1 space-y-5 min-w-0">

              {/* Seller card */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px] truncate">{selectedSubCart.businessName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''} commandé{selectedSubCart.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Boutique
                  </Badge>
                </div>
              </div>

              {/* Articles commandés */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Articles commandés
                  </h4>
                </div>
                <div className="max-h-[260px] overflow-y-auto px-4 pb-4">
                  <div className="space-y-2">
                    {selectedSubCart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-semibold">
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
              </div>

              {/* Livraison */}
              {deliveryData && (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Adresse de livraison
                    </h4>
                  </div>
                  <div className="px-4 pb-4 space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Destinataire</p>
                        <p className="text-sm font-medium truncate">{deliveryData.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Téléphone</p>
                        <p className="text-sm font-medium">{deliveryData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Adresse</p>
                        <p className="text-sm font-medium">{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</p>
                      </div>
                    </div>
                    {deliveryData.deliveryInstruction && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Instructions</p>
                          <p className="text-sm text-muted-foreground italic">{deliveryData.deliveryInstruction}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column — sticky summary ── */}
            <div className="lg:w-[300px] shrink-0">
              <div className="rounded-2xl border border-border bg-card lg:sticky lg:top-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-5 pt-5 pb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Résumé
                  </h4>
                </div>

                <div className="px-5 pb-5 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Sous-total
                      </span>
                      <span className="font-medium">{selectedSubCart.total.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        Livraison
                      </span>
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        Après acceptation
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {totalWithDelivery.toFixed(2)} €
                    </span>
                  </div>

                  {/* Payment info */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Paiement sécurisé après acceptation du vendeur
                    </p>
                  </div>
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
