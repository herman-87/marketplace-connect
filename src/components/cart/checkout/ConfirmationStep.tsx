import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [mobilePanel, setMobilePanel] = useState<0 | 1>(0);

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

  const panelLabels = ['Articles', 'Livraison'];
  const totalPanels = 2;

  const ArticlesList = () => (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none rounded-t-lg" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none rounded-b-lg" />
      <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1 py-2">
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
    </div>
  );

  const DeliveryCard = () => (
    deliveryData ? (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Livraison</span>
        </div>
        <div className="text-sm space-y-2.5">
          <div className="flex items-center gap-2.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>{deliveryData.fullName}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>{deliveryData.phone}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span>{deliveryData.address}, {deliveryData.city} {deliveryData.postalCode}</span>
          </div>
          {deliveryData.deliveryInstruction && (
            <div className="flex items-start gap-2.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground italic">{deliveryData.deliveryInstruction}</span>
            </div>
          )}
        </div>
      </div>
    ) : null
  );

  const InfoCard = () => (
    <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/15 text-xs text-muted-foreground space-y-1">
      <p className="flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        Aucun paiement ne sera prélevé à cette étape.
      </p>
      <p className="flex items-center gap-2">
        <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
        Votre commande sera envoyée au vendeur pour validation.
      </p>
      <p className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
        Vous serez notifié dès que le vendeur aura accepté ou refusé votre commande.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0">

        {/* Seller */}
        <div className="flex items-center gap-2 mb-3">
          <Store className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{selectedSubCart.businessName}</span>
          <span className="text-xs text-muted-foreground">· {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}</span>
        </div>

        {/* ── Mobile: panel switcher ── */}
        <div className="lg:hidden">
          {/* Nav buttons */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={mobilePanel === 0}
              onClick={() => setMobilePanel((mobilePanel - 1) as 0 | 1 | 2)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPanels }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobilePanel(i as 0 | 1 | 2)}
                  className={`h-1.5 rounded-full transition-all ${
                    mobilePanel === i ? 'w-5 bg-primary' : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={mobilePanel === totalPanels - 1}
              onClick={() => setMobilePanel((mobilePanel + 1) as 0 | 1 | 2)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Panel label */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            {panelLabels[mobilePanel]}
          </p>

          {/* Active panel */}
          {mobilePanel === 0 && <ArticlesList />}
          {mobilePanel === 1 && <DeliveryCard />}
          {mobilePanel === 2 && <InfoCard />}
        </div>

        {/* ── Desktop: side by side ── */}
        <div className="hidden lg:block">
          <div className="flex lg:gap-14 mb-4">
            <div className="flex-1 min-w-0">
              <ArticlesList />
            </div>
            <div className="w-[280px] shrink-0 space-y-4">
              <DeliveryCard />
              <InfoCard />
            </div>
          </div>
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
