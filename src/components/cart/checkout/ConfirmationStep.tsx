import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Store, ShoppingBag, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ConfirmationStepProps {
  selectedBusinessId: string | null;
  onTrackOrder: () => void;
  onClose: () => void;
}

export function ConfirmationStep({ selectedBusinessId, onTrackOrder, onClose }: ConfirmationStepProps) {
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
      <div className="flex-1 overflow-auto min-h-0 space-y-6 pb-4">
        {/* Business header */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{selectedSubCart.businessName}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Products list */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
            Récapitulatif de la commande
          </h4>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {selectedSubCart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Qté: {item.quantity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.price.toLocaleString()} FCFA / unité
                    </span>
                  </div>
                </div>
                <p className="font-bold text-sm whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total de la commande</span>
            <span className="text-xl font-bold text-primary">
              {selectedSubCart.total.toLocaleString()} FCFA
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Le paiement sera demandé uniquement après acceptation par le vendeur.
          </p>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl border border-border bg-muted/50 text-sm text-muted-foreground space-y-2">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            En confirmant, votre commande sera envoyée au vendeur pour validation.
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            Vous serez notifié dès que le vendeur aura accepté ou refusé.
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            Aucun paiement ne sera prélevé à cette étape.
          </p>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="space-y-3">
          <Button
            className="w-full h-12 gap-2 text-base"
            size="lg"
            onClick={onTrackOrder}
          >
            <ShoppingBag className="w-5 h-5" />
            Confirmer la commande
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={onClose}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </Button>
        </div>
      </div>
    </div>
  );
}
