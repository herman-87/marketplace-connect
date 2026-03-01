import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Package, MapPin, ArrowRight, Home, Store, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ConfirmationStepProps {
  selectedBusinessId: string | null;
  onTrackOrder: () => void;
  onClose: () => void;
}

export function ConfirmationStep({ selectedBusinessId, onTrackOrder, onClose }: ConfirmationStepProps) {
  const { subCarts, clearSubCart } = useCart();
  const selectedSubCart = subCarts.find(sc => sc.businessId === selectedBusinessId);

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const handleFinish = () => {
    if (selectedBusinessId) {
      clearSubCart(selectedBusinessId);
    }
    onClose();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0 flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
        {/* Status animation - Waiting for acceptance */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-warning" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-warning/15" style={{ animationDuration: '2.5s' }} />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Commande envoyée !
        </h2>
        <p className="text-muted-foreground mb-2">
          Votre commande a été transmise au vendeur
        </p>

        {/* Status badge */}
        <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/30 mb-6">
          <Clock className="w-3 h-3 mr-1" />
          En attente d'acceptation
        </Badge>

        {/* Order ID */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">N° de commande :</span>
          <Badge variant="secondary" className="font-mono">{orderId}</Badge>
        </div>

        {/* What happens next info box */}
        <div className="w-full p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 text-left">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary" />
            Prochaines étapes
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-warning">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Le vendeur examine votre commande</p>
                <p className="text-xs text-muted-foreground">Il vérifie la disponibilité des produits</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-muted-foreground">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Acceptation → Paiement</p>
                <p className="text-xs text-muted-foreground">Une fois acceptée, vous pourrez procéder au paiement</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-muted-foreground">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Préparation & Livraison</p>
                <p className="text-xs text-muted-foreground">Après paiement, votre commande sera préparée et livrée</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary card */}
        {selectedSubCart && (
          <div className="w-full p-6 rounded-xl border border-border bg-card mb-6 text-left">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              {selectedSubCart.businessName}
            </h3>
            
            <div className="space-y-3 mb-4">
              {selectedSubCart.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {selectedSubCart.items.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  +{selectedSubCart.items.length - 2} autre(s) article(s)
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>123 Rue de la Paix, Paris 75001</span>
              </div>
              <div className="flex justify-between font-semibold pt-2">
                <span>Total</span>
                <span className="text-primary">{selectedSubCart.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}

        {/* Info note */}
        <p className="text-xs text-muted-foreground">
          Vous recevrez une notification dès que le vendeur aura accepté ou refusé votre commande
        </p>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
        <div className="w-full space-y-3 max-w-lg mx-auto">
          <Button 
            className="w-full h-12 gap-2" 
            size="lg"
            onClick={onTrackOrder}
          >
            Suivre ma commande
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleFinish}
          >
            <Home className="w-4 h-4" />
            Continuer mes achats
          </Button>
        </div>
      </div>
    </div>
  );
}
