import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, MapPin, Clock, ArrowRight, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ConfirmationStepProps {
  selectedBusinessId: string | null;
  onTrackOrder: () => void;
  onClose: () => void;
}

export function ConfirmationStep({ selectedBusinessId, onTrackOrder, onClose }: ConfirmationStepProps) {
  const { subCarts, clearSubCart } = useCart();
  const selectedSubCart = subCarts.find(sc => sc.businessId === selectedBusinessId);

  // In a real app, this would be the order ID from the backend
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const handleFinish = () => {
    // Clear this sub-cart after successful order
    if (selectedBusinessId) {
      clearSubCart(selectedBusinessId);
    }
    onClose();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto min-h-0 flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" style={{ animationDuration: '2s' }} />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Commande confirmée !
        </h2>
        <p className="text-muted-foreground mb-6">
          Votre commande a été envoyée au vendeur
        </p>

        {/* Order ID */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-8">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Numéro de commande :</span>
          <Badge variant="secondary" className="font-mono">{orderId}</Badge>
        </div>

        {/* Order summary card */}
        {selectedSubCart && (
          <div className="w-full p-6 rounded-xl border border-border bg-card mb-8 text-left">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
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
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Livraison estimée : 3-5 jours</span>
              </div>
            </div>
          </div>
        )}

        {/* Info note */}
        <p className="text-xs text-muted-foreground">
          Vous recevrez une notification dès que le vendeur aura accepté votre commande
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
