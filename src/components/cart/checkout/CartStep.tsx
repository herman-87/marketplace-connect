import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, Store, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartStepProps {
  selectedBusinessId: string | null;
  onSelectBusiness: (businessId: string) => void;
  onContinue: () => void;
}

export function CartStep({ selectedBusinessId, onSelectBusiness, onContinue }: CartStepProps) {
  const { 
    subCarts, 
    totalItems, 
    updateQuantity, 
    removeFromCart,
    clearSubCart 
  } = useCart();

  if (subCarts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Votre panier est vide</h3>
        <p className="text-muted-foreground max-w-sm">
          Parcourez la marketplace et ajoutez des produits pour commencer vos achats
        </p>
      </div>
    );
  }

  const selectedSubCart = selectedBusinessId 
    ? subCarts.find(sc => sc.businessId === selectedBusinessId) 
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* Boutiques tabs - horizontal on mobile, vertical sidebar on desktop */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {subCarts.map((subCart) => (
            <button
              key={subCart.businessId}
              onClick={() => onSelectBusiness(subCart.businessId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all whitespace-nowrap shrink-0 ${
                selectedBusinessId === subCart.businessId 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-primary/50 bg-card text-foreground'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium truncate max-w-[120px]">{subCart.businessName}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                {subCart.items.length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Selected sub-cart items */}
        {selectedSubCart ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">
                {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''} · {selectedSubCart.total.toFixed(2)} €
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-muted-foreground hover:text-destructive"
                onClick={() => clearSubCart(selectedSubCart.businessId)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Vider
              </Button>
            </div>

            <div className="space-y-2">
              {selectedSubCart.items.map((item) => (
                <div 
                  key={`${item.businessId}-${item.id}`}
                  className="flex gap-3 p-2.5 rounded-lg bg-card border border-border"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-medium truncate">{item.name}</h5>
                      <p className="text-sm font-bold shrink-0">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {item.price.toFixed(2)} € / unité
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.businessId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs font-semibold w-5 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.businessId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id, item.businessId)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Store className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">Sélectionnez une boutique</h3>
            <p className="text-xs text-muted-foreground">
              Choisissez une boutique ci-dessus pour voir les détails
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom action */}
      {selectedSubCart && (
        <div className="sticky bottom-0 pt-3 pb-2 bg-background border-t border-border mt-auto shrink-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{selectedSubCart.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Livraison</span>
              <span className="text-muted-foreground">Calculé à l'étape suivante</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{selectedSubCart.total.toFixed(2)} €</span>
            </div>
            <Button 
              className="w-full h-11 text-sm gap-2" 
              size="lg"
              onClick={onContinue}
            >
              Continuer vers la livraison
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
