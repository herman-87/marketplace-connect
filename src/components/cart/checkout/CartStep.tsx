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
      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Sub-carts list */}
          <div className="lg:w-80 shrink-0">
            <h3 className="font-semibold mb-4 text-foreground">
              Vos boutiques ({subCarts.length})
            </h3>
            <ScrollArea className="h-[200px] lg:h-[calc(100vh-420px)]">
              <div className="space-y-3 pr-4">
                {subCarts.map((subCart) => (
                  <button
                    key={subCart.businessId}
                    onClick={() => onSelectBusiness(subCart.businessId)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedBusinessId === subCart.businessId 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{subCart.businessName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {subCart.items.length} article{subCart.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{subCart.total.toFixed(2)} €</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                💡 Chaque boutique nécessite un paiement séparé
              </p>
            </div>
          </div>

          {/* Right: Selected sub-cart details */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedSubCart ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedSubCart.businessName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSubCart.items.length} article{selectedSubCart.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => clearSubCart(selectedSubCart.businessId)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Vider
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedSubCart.items.map((item) => (
                    <div 
                      key={`${item.businessId}-${item.id}`}
                      className="flex gap-4 p-3 rounded-xl bg-card border border-border"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{item.name}</h5>
                        <p className="text-primary font-bold mt-1">
                          {item.price.toFixed(2)} €
                        </p>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.businessId, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.businessId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id, item.businessId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Sélectionnez une boutique</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez une boutique à gauche pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      {selectedSubCart && (
        <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-auto shrink-0">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{selectedSubCart.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span className="text-muted-foreground">Calculé à l'étape suivante</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{selectedSubCart.total.toFixed(2)} €</span>
            </div>
            <Button 
              className="w-full h-12 text-base gap-2" 
              size="lg"
              onClick={onContinue}
            >
              Continuer vers la livraison
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
